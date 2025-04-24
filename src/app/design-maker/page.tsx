'use client';

import { useState, useEffect } from 'react';
import { createClient } from '../../../supabase/client';
import { redirect } from 'next/navigation';
import DashboardNavbar from '@/components/dashboard-navbar';
import PrintfulEDM from '@/components/printful-edm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wand2, Image, Save, ShoppingCart } from 'lucide-react';

export default function DesignMaker() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('design');
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [aiImages, setAiImages] = useState<string[]>([]);
  const [designId, setDesignId] = useState<string>('');
  const [designName, setDesignName] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<number | undefined>();
  const [selectedVariantId, setSelectedVariantId] = useState<number | undefined>();
  const [nonce, setNonce] = useState<string>('');

  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
      } else {
        redirect('/sign-in');
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  const fetchNonce = async () => {
    if (!user) return;

    try {
      const res = await fetch('/api/generate-nonce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          user_agent: navigator.userAgent,
        }),
      });

      const data = await res.json();
      setNonce(data.nonce);
    } catch (error) {
      console.error('Error fetching nonce:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNonce();
    }
  }, [user]);

  const handleGenerateAI = async () => {
    if (!prompt) return;

    setGenerating(true);
    // Placeholder for AI image generation
    setTimeout(() => {
      setAiImages([
        'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80',
        'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&q=80',
        'https://images.unsplash.com/photo-1590523278191-995cbcda646b?w=400&q=80',
        'https://images.unsplash.com/photo-1557682224-5b
::contentReference[oaicite:0]{index=0}
 
