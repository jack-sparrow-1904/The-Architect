
    import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Vision } from '@/types';
import { toast } from 'sonner';

export const useVision = () => {
  const { user } = useAuth();
  const [vision, setVision] = useState<Vision | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVision = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('visions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error &amp;&amp; error.code !== '