
-- Create specialist_schedules table for storing work schedules
CREATE TABLE public.specialist_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  specialist_id UUID REFERENCES public.specialists(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  time_slots TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(specialist_id, date)
);

-- Enable RLS
ALTER TABLE public.specialist_schedules ENABLE ROW LEVEL SECURITY;

-- Create policies for specialist_schedules
CREATE POLICY "Allow public read access to specialist_schedules" 
  ON public.specialist_schedules 
  FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "Allow authenticated users to manage specialist_schedules" 
  ON public.specialist_schedules 
  FOR ALL 
  TO authenticated 
  USING (true);

-- Add updated_at trigger
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.specialist_schedules
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
