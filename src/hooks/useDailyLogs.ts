import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Log, DailyLog, System } from '@/types';
import { format, parseISO } from 'date-fns';

export const useDailyLogs = (date: Date) => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [customSystems, setCustomSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formattedDate = format(date, 'yyyy-MM-dd');

  const fetchLogsAndSystems = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // Fetch custom systems
      const { data: systemsData, error: systemsError } = await supabase
        .from('systems')
        .select('*')
        .eq('user_id', user.id);

      if (systemsError) throw systemsError;
      setCustomSystems(systemsData || []);

      // Fetch logs for the given date
      const { data: logsData, error: logsError } = await supabase
        .from('logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('log_date', formattedDate);

      if (logsError) throw logsError;
      
      const combinedLogs: DailyLog[] = (logsData || []).map(log => {
        if (log.system_id) {
          const system = systemsData?.find(s => s.id === log.system_id);
          return { 
            ...log, 
            log_date: format(parseISO(log.log_date), 'yyyy-MM-dd'), // Ensure correct format
            system_name: system?.name, 
            tracker_type: system?.tracker_type 
          };
        }
        return { 
          ...log,
          log_date: format(parseISO(log.log_date), 'yyyy-MM-dd') // Ensure correct format
        };
      });
      setLogs(combinedLogs);

    } catch (err: any) {
      console.error("Error fetching logs/systems:", err);
      setError(err.message || 'Failed to fetch daily logs and systems.');
    } finally {
      setLoading(false);
    }
  }, [user, formattedDate]);

  useEffect(() => {
    fetchLogsAndSystems();
  }, [fetchLogsAndSystems]);

  const upsertLog = async (logEntry: Omit<Log, 'id' | 'user_id' | 'created_at'>): Promise<Log | null> => {
    if (!user) return null;
    
    const entryToUpsert: Log = {
      ...logEntry,
      user_id: user.id,
      log_date: formattedDate, // Ensure log_date is always the current formattedDate
    };

    // Determine unique constraint fields based on whether it's a prescriptive or custom system log
    const conflictFields = logEntry.prescriptive_system_key 
      ? ['user_id', 'prescriptive_system_key', 'log_date'] 
      : ['user_id', 'system_id', 'log_date'];

    const { data, error: upsertError } = await supabase
      .from('logs')
      .upsert(entryToUpsert, { onConflict: conflictFields.join(','), ignoreDuplicates: false })
      .select()
      .single();

    if (upsertError) {
      console.error('Error upserting log:', upsertError);
      setError(upsertError.message);
      return null;
    }
    
    // Refetch logs to update UI
    await fetchLogsAndSystems();
    return data ? { ...data, log_date: format(parseISO(data.log_date), 'yyyy-MM-dd') } : null;
  };
  
  const addSystem = async (system: Omit<System, 'id' | 'user_id' | 'created_at'>): Promise<System | null> => {
    if (!user) return null;

    const { data, error: insertError } = await supabase
      .from('systems')
      .insert({ ...system, user_id: user.id })
      .select()
      .single();

    if (insertError) {
      console.error('Error adding system:', insertError);
      setError(insertError.message);
      return null;
    }
    await fetchLogsAndSystems(); // Refresh systems and logs
    return data;
  };


  return { logs, customSystems, loading, error, upsertLog, addSystem, refetchLogs: fetchLogsAndSystems };
};
