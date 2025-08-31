import { useState, useEffect } from 'react';
import { Calculator, Baby, Lightbulb, AlertTriangle, Info, Copy, Check, ArrowLeftRight } from 'lucide-react';

interface BilirubinResult {
  photoThreshold: number;
  exchangeThreshold: number | null;
  recommendation: string;
  urgency: 'normal' | 'moderate' | 'critical';
  bilirubinLevel: number;
}

const BilirubinCalculator = () => {
  type CareSetting = 'NICU' | 'Nursery'; // 'פגיה' | 'תינוקיה'
  const [gestationalAge, setGestationalAge] = useState('');
  const [hoursOfLife, setHoursOfLife] = useState('');
  const [hasRiskFactors, setHasRiskFactors] = useState(false);
  const [bilirubinLevel, setBilirubinLevel] = useState('');
  const [results, setResults] = useState<BilirubinResult | { error: string } | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [careSetting, setCareSetting] = useState<CareSetting>('Nursery');

  // נתוני הטבלאות מהמסמך – פרוטוקול פגיה (קיימים בקוד המקורי)
  const phototherapyData = {
    noRisk: {
      35: [6.4, 6.6, 6.8, 7.0, 7.2, 7.4, 7.6, 7.8, 7.9, 8.1, 8.3, 8.5, 8.7, 8.9, 9.0, 9.2, 9.4, 9.6, 9.8, 9.9, 10.1, 10.3, 10.4, 10.6, 10.8, 10.9, 11.1, 11.3, 11.4, 11.6, 11.7, 11.9, 12.0, 12.2, 12.3, 12.5, 12.6, 12.8, 12.9, 13.1, 13.2, 13.4, 13.5, 13.6, 13.8, 13.9, 14.0, 14.2, 14.3, 14.4, 14.5, 14.7, 14.8, 14.9, 15.0, 15.1, 15.3, 15.4, 15.5, 15.6, 15.7, 15.8, 15.9, 16.0, 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7, 16.8, 16.9, 17.0, 17.1, 17.2, 17.3, 17.4, 17.5, 17.5, 17.6, 17.7, 17.8, 17.8, 17.9, 18.0, 18.1, 18.1, 18.2, 18.3, 18.3, 18.4, 18.5, 18.5, 18.6, 18.6, 18.6, 18.6, 18.6, 18.6],
      36: [6.9, 7.1, 7.3, 7.5, 7.7, 7.9, 8.1, 8.3, 8.5, 8.7, 8.8, 9.0, 9.2, 9.4, 9.6, 9.8, 9.9, 10.1, 10.3, 10.5, 10.6, 10.8, 11.0, 11.2, 11.3, 11.5, 11.7, 11.8, 12.0, 12.1, 12.3, 12.5, 12.6, 12.8, 12.9, 13.1, 13.2, 13.4, 13.5, 13.7, 13.8, 13.9, 14.1, 14.2, 14.4, 14.5, 14.6, 14.8, 14.9, 15.0, 15.1, 15.3, 15.4, 15.5, 15.6, 15.8, 15.9, 16.0, 16.1, 16.2, 16.3, 16.5, 16.6, 16.7, 16.8, 16.9, 17.0, 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7, 17.8, 17.9, 17.9, 18.0, 18.1, 18.2, 18.3, 18.4, 18.4, 18.5, 18.6, 18.7, 18.8, 18.8, 18.9, 19.0, 19.0, 19.1, 19.2, 19.2, 19.3, 19.3, 19.3, 19.3, 19.3, 19.3],
      37: [7.4, 7.6, 7.8, 8.0, 8.2, 8.4, 8.6, 8.8, 9.0, 9.2, 9.4, 9.6, 9.8, 9.9, 10.1, 10.3, 10.5, 10.7, 10.8, 11.0, 11.2, 11.4, 11.5, 11.7, 11.9, 12.1, 12.2, 12.4, 12.5, 12.7, 12.9, 13.0, 13.2, 13.3, 13.5, 13.6, 13.8, 13.9, 14.1, 14.2, 14.4, 14.5, 14.7, 14.8, 15.0, 15.1, 15.2, 15.4, 15.5, 15.6, 15.8, 15.9, 16.0, 16.1, 16.3, 16.4, 16.5, 16.6, 16.7, 16.9, 17.0, 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7, 17.8, 17.9, 18.0, 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 18.7, 18.8, 18.9, 19.0, 19.0, 19.1, 19.2, 19.3, 19.4, 19.4, 19.5, 19.6, 19.7, 19.7, 19.8, 19.9, 19.9, 20.0, 20.0, 20.1, 20.1, 20.1, 20.1],
      38: [7.9, 8.1, 8.3, 8.5, 8.7, 8.9, 9.1, 9.3, 9.5, 9.7, 9.9, 10.1, 10.3, 10.5, 10.7, 10.8, 11.0, 11.2, 11.4, 11.6, 11.7, 11.9, 12.1, 12.3, 12.4, 12.6, 12.8, 12.9, 13.1, 13.3, 13.4, 13.6, 13.8, 13.9, 14.1, 14.2, 14.4, 14.5, 14.7, 14.8, 15.0, 15.1, 15.3, 15.4, 15.6, 15.7, 15.8, 16.0, 16.1, 16.2, 16.4, 16.5, 16.6, 16.8, 16.9, 17.0, 17.1, 17.3, 17.4, 17.5, 17.6, 17.7, 17.8, 17.9, 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 18.7, 18.8, 18.9, 19.0, 19.1, 19.2, 19.3, 19.4, 19.5, 19.5, 19.6, 19.7, 19.8, 19.9, 20.0, 20.0, 20.1, 20.2, 20.3, 20.3, 20.4, 20.5, 20.6, 20.6, 20.7, 20.7, 20.8, 20.8, 20.8, 20.8],
      39: [8.4, 8.6, 8.8, 9.0, 9.3, 9.5, 9.7, 9.9, 10.0, 10.2, 10.4, 10.6, 10.8, 11.0, 11.2, 11.4, 11.6, 11.8, 11.9, 12.1, 12.3, 12.5, 12.7, 12.8, 13.0, 13.2, 13.3, 13.5, 13.7, 13.8, 14.0, 14.2, 14.3, 14.5, 14.7, 14.8, 15.0, 15.1, 15.3, 15.4, 15.6, 15.7, 15.9, 16.0, 16.2, 16.3, 16.4, 16.6, 16.7, 16.8, 17.0, 17.1, 17.2, 17.4, 17.5, 17.6, 17.8, 17.9, 18.0, 18.1, 18.2, 18.4, 18.5, 18.6, 18.7, 18.8, 18.9, 19.0, 19.1, 19.2, 19.3, 19.5, 19.6, 19.7, 19.7, 19.8, 19.9, 20.0, 20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 20.6, 20.7, 20.8, 20.9, 21.0, 21.0, 21.1, 21.2, 21.3, 21.3, 21.4, 21.5, 21.5, 21.5, 21.5, 21.5],
      40: [8.9, 9.1, 9.3, 9.6, 9.8, 10.0, 10.2, 10.4, 10.5, 10.7, 10.9, 11.1, 11.3, 11.5, 11.7, 11.9, 12.1, 12.2, 12.4, 12.6, 12.8, 13.0, 13.1, 13.3, 13.5, 13.6, 13.8, 14.0, 14.1, 14.3, 14.5, 14.6, 14.8, 15.0, 15.1, 15.3, 15.4, 15.6, 15.7, 15.9, 16.0, 16.2, 16.3, 16.4, 16.6, 16.7, 16.9, 17.0, 17.1, 17.3, 17.4, 17.5, 17.7, 17.8, 17.9, 18.0, 18.2, 18.3, 18.4, 18.5, 18.6, 18.8, 18.9, 19.0, 19.1, 19.2, 19.3, 19.4, 19.6, 19.7, 19.7, 19.8, 19.9, 20.0, 20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 20.7, 20.7, 20.8, 20.9, 21.0, 21.1, 21.1, 21.2, 21.3, 21.4, 21.4, 21.5, 21.6, 21.6, 21.7, 21.8, 21.8, 21.8, 21.8, 21.8]
    },
    withRisk: {
      35: [4.9, 5.1, 5.3, 5.5, 5.6, 5.8, 6.0, 6.2, 6.4, 6.5, 6.7, 6.9, 7.1, 7.2, 7.4, 7.6, 7.7, 7.9, 8.1, 8.2, 8.4, 8.6, 8.7, 8.9, 9.0, 9.2, 9.3, 9.5, 9.6, 9.8, 9.9, 10.1, 10.2, 10.3, 10.5, 10.6, 10.8, 10.9, 11.0, 11.2, 11.3, 11.4, 11.5, 11.7, 11.8, 11.9, 12.0, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 13.0, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9, 14.0, 14.1, 14.2, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8, 14.8, 14.9, 15.0, 15.1, 15.1, 15.2, 15.3, 15.3, 15.4, 15.5, 15.5, 15.6, 15.7, 15.7, 15.8, 15.8, 15.9, 15.9, 16.0, 16.1, 16.1, 16.1, 16.2, 16.2, 16.2, 16.2],
      36: [5.4, 5.6, 5.8, 6.0, 6.2, 6.3, 6.5, 6.7, 6.9, 7.1, 7.3, 7.4, 7.6, 7.8, 8.0, 8.1, 8.3, 8.5, 8.6, 8.8, 9.0, 9.1, 9.3, 9.4, 9.6, 9.8, 9.9, 10.1, 10.2, 10.4, 10.5, 10.7, 10.8, 11.0, 11.1, 11.2, 11.4, 11.5, 11.7, 11.8, 11.9, 12.1, 12.2, 12.3, 12.5, 12.6, 12.7, 12.8, 13.0, 13.1, 13.2, 13.3, 13.4, 13.5, 13.7, 13.8, 13.9, 14.0, 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8, 14.9, 15.0, 15.1, 15.2, 15.3, 15.4, 15.4, 15.5, 15.6, 15.7, 15.8, 15.8, 15.9, 16.0, 16.1, 16.1, 16.2, 16.3, 16.4, 16.4, 16.5, 16.6, 16.6, 16.7, 16.7, 16.8, 16.8, 16.9, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0],
      37: [5.9, 6.1, 6.3, 6.5, 6.7, 6.9, 7.0, 7.2, 7.4, 7.6, 7.8, 8.0, 8.1, 8.3, 8.5, 8.7, 8.9, 9.0, 9.2, 9.4, 9.5, 9.7, 9.9, 10.0, 10.2, 10.4, 10.5, 10.7, 10.8, 11.0, 11.1, 11.3, 11.4, 11.6, 11.7, 11.9, 12.0, 12.2, 12.3, 12.4, 12.6, 12.7, 12.9, 13.0, 13.1, 13.2, 13.4, 13.5, 13.6, 13.8, 13.9, 14.0, 14.1, 14.2, 14.4, 14.5, 14.6, 14.7, 14.8, 14.9, 15.0, 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 15.8, 15.9, 16.0, 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.6, 16.7, 16.8, 16.9, 17.0, 17.0, 17.1, 17.2, 17.2, 17.3, 17.4, 17.4, 17.5, 17.6, 17.6, 17.7, 17.8, 17.8, 17.9, 18.0, 18.0, 18.0, 18.0],
      38: [6.4, 6.6, 6.8, 7.0, 7.2, 7.3, 7.5, 7.7, 7.9, 8.1, 8.3, 8.5, 8.6, 8.8, 9.0, 9.2, 9.4, 9.5, 9.7, 9.9, 10.0, 10.2, 10.4, 10.5, 10.7, 10.8, 11.0, 11.2, 11.3, 11.5, 11.6, 11.8, 11.9, 12.1, 12.2, 12.4, 12.5, 12.7, 12.8, 12.9, 13.1, 13.2, 13.3, 13.5, 13.6, 13.7, 13.9, 14.0, 14.1, 14.2, 14.4, 14.5, 14.6, 14.7, 14.8, 14.9, 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 15.8, 15.9, 16.0, 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.6, 16.7, 16.8, 16.9, 17.0, 17.1, 17.1, 17.2, 17.3, 17.4, 17.4, 17.5, 17.6, 17.6, 17.7, 17.8, 17.8, 17.9, 18.0, 18.0, 18.1, 18.1, 18.2, 18.2, 18.2, 18.2, 18.2, 18.2]
    }
  };

  const exchangeData = {
    noRisk: {
      35: [14.9, 15.0, 15.1, 15.3, 15.4, 15.6, 15.7, 15.8, 16.0, 16.1, 16.2, 16.4, 16.5, 16.6, 16.8, 16.9, 17.0, 17.2, 17.3, 17.4, 17.5, 17.7, 17.8, 17.9, 18.0, 18.2, 18.3, 18.4, 18.5, 18.7, 18.8, 18.9, 19.0, 19.1, 19.2, 19.4, 19.5, 19.6, 19.7, 19.8, 19.9, 20.0, 20.1, 20.2, 20.3, 20.5, 20.6, 20.7, 20.8, 20.9, 21.0, 21.1, 21.2, 21.3, 21.4, 21.5, 21.6, 21.7, 21.7, 21.8, 21.9, 22.0, 22.1, 22.2, 22.3, 22.4, 22.5, 22.6, 22.6, 22.7, 22.8, 22.9, 23.0, 23.1, 23.1, 23.2, 23.3, 23.4, 23.4, 23.5, 23.6, 23.7, 23.7, 23.8, 23.9, 23.9, 24.0, 24.1, 24.1, 24.2, 24.3, 24.3, 24.4, 24.4, 24.5, 24.5, 24.5, 24.5, 24.5, 24.5],
      36: [15.9, 16.1, 16.2, 16.4, 16.5, 16.7, 16.8, 16.9, 17.1, 17.2, 17.4, 17.5, 17.7, 17.8, 17.9, 18.1, 18.2, 18.3, 18.5, 18.6, 18.7, 18.9, 19.0, 19.1, 19.2, 19.4, 19.5, 19.6, 19.7, 19.9, 20.0, 20.1, 20.2, 20.4, 20.5, 20.6, 20.7, 20.8, 20.9, 21.0, 21.2, 21.3, 21.4, 21.5, 21.6, 21.7, 21.8, 21.9, 22.0, 22.1, 22.2, 22.3, 22.4, 22.5, 22.6, 22.7, 22.8, 22.9, 23.0, 23.1, 23.2, 23.2, 23.3, 23.4, 23.5, 23.6, 23.7, 23.8, 23.8, 23.9, 24.0, 24.1, 24.1, 24.2, 24.3, 24.4, 24.4, 24.5, 24.6, 24.6, 24.7, 24.8, 24.8, 24.9, 25.0, 25.0, 25.1, 25.2, 25.2, 25.3, 25.3, 25.4, 25.4, 25.5, 25.5, 25.5, 25.5, 25.5, 25.5, 25.6],
      37: [17.0, 17.1, 17.3, 17.5, 17.6, 17.8, 17.9, 18.1, 18.2, 18.4, 18.5, 18.7, 18.8, 18.9, 19.1, 19.2, 19.4, 19.5, 19.6, 19.8, 19.9, 20.1, 20.2, 20.3, 20.5, 20.6, 20.7, 20.8, 21.0, 21.1, 21.2, 21.3, 21.5, 21.6, 21.7, 21.8, 21.9, 22.1, 22.2, 22.3, 22.4, 22.5, 22.6, 22.7, 22.8, 22.9, 23.0, 23.1, 23.2, 23.3, 23.4, 23.5, 23.6, 23.7, 23.8, 23.9, 24.0, 24.1, 24.2, 24.3, 24.4, 24.5, 24.5, 24.6, 24.7, 24.8, 24.9, 24.9, 25.0, 25.1, 25.2, 25.2, 25.3, 25.4, 25.5, 25.5, 25.6, 25.7, 25.7, 25.8, 25.8, 25.9, 26.0, 26.0, 26.1, 26.1, 26.2, 26.2, 26.3, 26.3, 26.4, 26.4, 26.5, 26.5, 26.5, 26.6, 26.6, 26.6, 26.6, 26.6],
      38: [18.0, 18.2, 18.4, 18.5, 18.7, 18.8, 19.0, 19.1, 19.3, 19.4, 19.6, 19.7, 19.9, 20.0, 20.1, 20.3, 20.4, 20.6, 20.7, 20.8, 21.0, 21.1, 21.2, 21.4, 21.5, 21.6, 21.7, 21.9, 22.0, 22.1, 22.2, 22.3, 22.4, 22.6, 22.7, 22.8, 22.9, 23.0, 23.1, 23.2, 23.3, 23.4, 23.5, 23.6, 23.7, 23.8, 23.9, 24.0, 24.1, 24.2, 24.3, 24.4, 24.5, 24.6, 24.7, 24.7, 24.8, 24.9, 25.0, 25.1, 25.2, 25.2, 25.3, 25.4, 25.5, 25.5, 25.6, 25.7, 25.7, 25.8, 25.9, 25.9, 26.0, 26.0, 26.1, 26.2, 26.2, 26.3, 26.3, 26.4, 26.4, 26.5, 26.5, 26.6, 26.6, 26.7, 26.7, 26.7, 26.8, 26.8, 26.9, 26.9, 26.9, 27.0, 27.0, 27.0, 27.0, 27.0, 27.0, 27.0]
    },
    withRisk: {
      35: [13.1, 13.3, 13.4, 13.6, 13.7, 13.8, 14.0, 14.1, 14.3, 14.4, 14.5, 14.6, 14.8, 14.9, 15.0, 15.1, 15.3, 15.4, 15.5, 15.6, 15.8, 15.9, 16.0, 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.8, 16.9, 17.0, 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7, 17.7, 17.8, 17.9, 18.0, 18.1, 18.2, 18.3, 18.4, 18.5, 18.5, 18.6, 18.7, 18.8, 18.9, 18.9, 19.0, 19.1, 19.2, 19.2, 19.3, 19.4, 19.4, 19.5, 19.6, 19.6, 19.7, 19.8, 19.8, 19.9, 19.9, 20.0, 20.1, 20.1, 20.2, 20.2, 20.3, 20.3, 20.4, 20.4, 20.5, 20.5, 20.6, 20.6, 20.6, 20.7, 20.7, 20.8, 20.8, 20.8, 20.9, 20.9, 20.9, 21.0, 21.0, 21.0, 21.1, 21.1, 21.1, 21.1, 21.1, 21.1],
      36: [13.7, 13.9, 14.0, 14.1, 14.3, 14.4, 14.5, 14.7, 14.8, 14.9, 15.1, 15.2, 15.3, 15.4, 15.6, 15.7, 15.8, 15.9, 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.8, 16.9, 17.0, 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7, 17.8, 17.9, 18.0, 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 18.7, 18.8, 18.9, 19.0, 19.1, 19.2, 19.2, 19.3, 19.4, 19.5, 19.6, 19.7, 19.7, 19.8, 19.9, 20.0, 20.1, 20.1, 20.2, 20.3, 20.3, 20.4, 20.5, 20.6, 20.6, 20.7, 20.8, 20.8, 20.9, 20.9, 21.0, 21.1, 21.1, 21.2, 21.2, 21.3, 21.4, 21.4, 21.5, 21.5, 21.6, 21.6, 21.7, 21.7, 21.8, 21.8, 21.9, 21.9, 22.0, 22.0, 22.0, 22.1, 22.1, 22.1, 22.1, 22.1, 22.1],
      37: [14.3, 14.4, 14.6, 14.7, 14.8, 15.0, 15.1, 15.2, 15.4, 15.5, 15.6, 15.7, 15.9, 16.0, 16.1, 16.2, 16.4, 16.5, 16.6, 16.7, 16.8, 17.0, 17.1, 17.2, 17.3, 17.4, 17.5, 17.7, 17.8, 17.9, 18.0, 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 18.7, 18.8, 18.9, 19.0, 19.1, 19.2, 19.3, 19.4, 19.5, 19.6, 19.7, 19.8, 19.9, 20.0, 20.1, 20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 20.7, 20.7, 20.8, 20.9, 21.0, 21.1, 21.1, 21.2, 21.3, 21.4, 21.4, 21.5, 21.6, 21.7, 21.7, 21.8, 21.9, 21.9, 22.0, 22.1, 22.1, 22.2, 22.3, 22.3, 22.4, 22.5, 22.5, 22.6, 22.6, 22.7, 22.8, 22.8, 22.9, 22.9, 23.0, 23.0, 23.1, 23.1, 23.1, 23.1, 23.1, 23.1],
      38: [14.8, 15.0, 15.1, 15.2, 15.4, 15.5, 15.6, 15.8, 15.9, 16.0, 16.1, 16.3, 16.4, 16.5, 16.6, 16.7, 16.9, 17.0, 17.1, 17.2, 17.3, 17.4, 17.6, 17.7, 17.8, 17.9, 18.0, 18.1, 18.2, 18.3, 18.4, 18.5, 18.7, 18.8, 18.9, 19.0, 19.1, 19.2, 19.3, 19.4, 19.5, 19.6, 19.7, 19.8, 19.9, 19.9, 20.0, 20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 20.7, 20.8, 20.8, 20.9, 21.0, 21.1, 21.2, 21.3, 21.3, 21.4, 21.5, 21.6, 21.7, 21.7, 21.8, 21.9, 22.0, 22.0, 22.1, 22.2, 22.2, 22.3, 22.4, 22.5, 22.5, 22.6, 22.7, 22.7, 22.8, 22.8, 22.9, 23.0, 23.0, 23.1, 23.1, 23.2, 23.3, 23.3, 23.4, 23.4, 23.5, 23.5, 23.5, 23.5, 23.5, 23.5, 23.5]
    }
  };

  // --- תינוקיה: דאטה ספציפי (ללא אינטרפולציה) ---
  type SparseMap = Record<number, Record<number, number>>;
  const nurseryPhototherapyNoRisk: SparseMap = {
    35: { 0: 5, 12: 7.5, 18: 8.8, 20: 9.2, 24: 9.9, 28: 10.5, 32: 11.1, 36: 11.7, 40: 12.2, 44: 12.6, 48: 13.1, 52: 13.6, 56: 14.1, 60: 14.6, 64: 14.9, 68: 15.2, 72: 15.5, 76: 15.9, 80: 16.2, 84: 16.6, 88: 16.9, 92: 17.2, 96: 17.5, 100: 17.7, 104: 17.8, 108: 18 },
    37: { 0: 5, 12: 7.5, 18: 8.5, 20: 9, 24: 9.5, 28: 10, 32: 11, 36: 11.5, 40: 12, 44: 12.5, 48: 13, 52: 13.5, 56: 14, 60: 14.5, 64: 14.5, 68: 15, 72: 15.5, 76: 15.5, 80: 16, 84: 16.5, 88: 16.5, 92: 17, 96: 17, 100: 17.5, 104: 17.5, 108: 18 },
    38: { 0: 5, 12: 8, 18: 10.4, 20: 10.8, 24: 11.7, 28: 12.3, 32: 13, 36: 13.6, 40: 14.2, 44: 14.7, 48: 15.3, 52: 15.7, 56: 16.2, 60: 16.6, 64: 17, 68: 17.3, 72: 17.7, 76: 18.1, 80: 18.5, 84: 18.9, 88: 19.2, 92: 19.6, 96: 19.9, 100: 20.1, 104: 20.4, 108: 20.6 }
  };
  const nurseryPhototherapyWithRisk: SparseMap = {
    35: { 0: 5, 12: 6, 18: 7, 20: 7.3, 24: 8, 28: 8.5, 32: 9.1, 36: 9.6, 40: 10.2, 44: 10.8, 48: 11.4, 52: 11.8, 56: 12.1, 60: 12.5, 64: 12.9, 68: 13.2, 72: 13.6, 76: 13.8, 80: 14, 84: 14.2, 88: 14.3, 92: 14.4, 96: 14.5, 100: 14.7, 104: 14.8, 108: 15 },
    37: { 0: 4, 12: 6, 18: 7, 20: 7.5, 24: 7.5, 28: 8, 32: 9, 36: 9.5, 40: 10, 44: 10.5, 48: 11, 52: 11.5, 56: 12, 60: 12.5, 64: 12.5, 68: 13, 72: 13.5, 76: 13.5, 80: 14, 84: 14, 88: 14, 92: 14.5, 96: 14.5, 100: 14.5, 104: 14.8, 108: 15 },
    38: { 0: 5, 12: 7.5, 18: 8.8, 20: 9.2, 24: 9.9, 28: 10.5, 32: 11.1, 36: 11.7, 40: 12.2, 44: 12.6, 48: 13.1, 52: 13.6, 56: 14.1, 60: 14.6, 64: 14.9, 68: 15.2, 72: 15.5, 76: 15.9, 80: 16.2, 84: 16.6, 88: 16.9, 92: 17.2, 96: 17.5, 100: 17.7, 104: 17.8, 108: 18 }
  };

  const normalizeNurseryWeek = (w: number) => {
    if (w === 36) return 35;
    if (w >= 38) return 38;
    return w;
  };

const getNurseryThreshold = (sparse: SparseMap, gestAge: number, hours: number): number | null => {
  const wk = normalizeNurseryWeek(gestAge);
  const table = sparse[wk];
  if (!table) return null;
  // ללא אינטרפולציה: בחר את השעה הגדולה ביותר שאינה עולה על השעה המבוקשת (step)
  const keys = Object.keys(table).map(Number).sort((a, b) => a - b);
  let candidate: number | undefined = undefined;
  for (const k of keys) {
    if (k <= hours) candidate = k;
    else break;
  }
  if (candidate === undefined) return null; // אין ערך עד השעה הזו
  return table[candidate];
};

  const getNICUThreshold = (data: Record<number, number[]>, gestAge: number, hours: number): number | null => {
    if (!data[gestAge] || hours < 1 || hours > 336) return null;
    const index = Math.min(hours - 1, data[gestAge].length - 1);
    return data[gestAge][index];
  };

  const toBoldDigits = (number: number): string => {
    const boldDigits = ['𝟎', '𝟏', '𝟐', '𝟑', '𝟒', '𝟓', '𝟔', '𝟕', '𝟖', '𝟗'];
    return number.toString().split('').map((char) => {
      const digit = parseInt(char);
      return isNaN(digit) ? char : boldDigits[digit];
    }).join('');
  };

  const generateCopyText = () => {
    if (!gestationalAge || !hoursOfLife) return '';

    const gestAge = parseInt(gestationalAge);
    const hours = parseInt(hoursOfLife);

    const prefix = hasRiskFactors ? 'עם ג"ס - ' : 'בלי ג"ס - ';
    const thresholds: string[] = [];

    if (careSetting === 'Nursery') {
      const sparse = hasRiskFactors ? nurseryPhototherapyWithRisk : nurseryPhototherapyNoRisk;
      const wk = normalizeNurseryWeek(gestAge);
      const table = sparse[wk] || {};
      const sortedHours = Object.keys(table).map(Number).sort((a, b) => a - b);
      // STEP: להתחיל מהמדרגה האחרונה שאינה גדולה מהשעה המבוקשת (≤ hours)
      let startIdx = -1;
      for (let i = 0; i < sortedHours.length; i++) {
        if (sortedHours[i] <= hours) startIdx = i;
        else break;
      }
      if (startIdx < 0) startIdx = 0; // ביטחון – אמור להיות 0 קיים בדאטה
      for (let i = startIdx; i < sortedHours.length; i++) {
        const h = sortedHours[i];
        if (h > hours + 72) break;
        const val = table[h];
        const bh = toBoldDigits(h);
        thresholds.push(`${bh}←${val.toFixed(1)}`);
      }
    } else {
      const photoData = hasRiskFactors ? phototherapyData.withRisk : phototherapyData.noRisk;
      for (let currentHour = hours; currentHour <= hours + 72; currentHour += 4) {
        if (currentHour > 336) break;
        const threshold = getNICUThreshold(photoData, gestAge, currentHour);
        if (threshold !== null) {
          const boldHour = toBoldDigits(currentHour);
          thresholds.push(`${boldHour}←${threshold.toFixed(1)}`);
        }
      }
    }

    if (thresholds.length === 0) return prefix.trim();

    const first = thresholds[0].split('←');
    const firstHour = first[0];
    const firstVal = first[1];
    const firstFormatted = `בשעה ${firstHour}← סף לטיפול באור ${Number(firstVal).toFixed(1)}`;
    const rest = thresholds.slice(1);
    const body = [firstFormatted, ...rest].join(', ');
    return prefix + body;
  };

  const copyToClipboard = async () => {
    const text = generateCopyText();
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const calculateResults = () => {
    if (!gestationalAge || !hoursOfLife || !bilirubinLevel) {
      setResults(null);
      return;
    }

    const gestAge = parseInt(gestationalAge);
    const hours = parseInt(hoursOfLife);
    const bilirubin = parseFloat(bilirubinLevel);

    const hoursMin = careSetting === 'Nursery' ? 0 : 1;
    if (gestAge < 35 || gestAge > 40 || hours < hoursMin || hours > 336 || bilirubin < 0) {
      setResults({ error: 'נתונים לא תקינים' });
      return;
    }

    let photoThreshold: number | null = null;
    let exchangeThreshold: number | null = null;

    if (careSetting === 'Nursery') {
      const sparse = hasRiskFactors ? nurseryPhototherapyWithRisk : nurseryPhototherapyNoRisk;
      photoThreshold = getNurseryThreshold(sparse, gestAge, hours);
      exchangeThreshold = null; // אין בתינוקיה
    } else {
      const photoData = hasRiskFactors ? phototherapyData.withRisk : phototherapyData.noRisk;
      const exchangeDataSet = hasRiskFactors ? exchangeData.withRisk : exchangeData.noRisk;
      photoThreshold = getNICUThreshold(photoData, gestAge, hours);
      exchangeThreshold = getNICUThreshold(exchangeDataSet, gestAge, hours);
    }

    let recommendation = '';
    let urgency: 'normal' | 'moderate' | 'critical' = 'normal';

    if (exchangeThreshold !== null && bilirubin >= exchangeThreshold) {
      recommendation = 'נדרש החלפת דם מיידית!';
      urgency = 'critical';
    } else if (photoThreshold !== null && bilirubin >= photoThreshold) {
      recommendation = 'נדרש טיפול באור (פוטותרפיה)';
      urgency = 'moderate';
    } else {
      recommendation = 'המשך מעקב לפי פרוטוקול';
      urgency = 'normal';
    }

    setResults({
      photoThreshold: photoThreshold ?? NaN,
      exchangeThreshold,
      recommendation,
      urgency,
      bilirubinLevel: bilirubin
    });
  };

  useEffect(() => {
    calculateResults();
  }, [gestationalAge, hoursOfLife, hasRiskFactors, bilirubinLevel, careSetting]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4" dir="rtl">
      <style dangerouslySetInnerHTML={{
        __html: `
          input[type=number]::-webkit-outer-spin-button,
          input[type=number]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
        `
      }} />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 relative">
          {/* Switch בין פגיה לתינוקיה */}
          <div className="absolute left-0 top-0">
            <button
              onClick={() => setCareSetting(prev => (prev === 'NICU' ? 'Nursery' : 'NICU'))}
              className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur rounded-lg shadow hover:bg-white transition"
              aria-label="החלף בין פגיה לתינוקיה"
              title="החלף בין פגיה לתינוקיה"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span className="text-sm font-medium">
                {careSetting === 'NICU' ? 'פגיה' : 'תינוקיה'}
              </span>
            </button>
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">מחשבון צהבת ילודים</h1>
          </div>
          <p className="text-gray-600">
            {careSetting === 'NICU'
              ? 'טיפול באור והחלפת דם (פרוטוקול פגיה) – 35–40 שבועות'
              : 'טיפול באור (תינוקיה, ללא החלפת דם) – 35–40 שבועות'}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Baby className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">נתוני התינוק</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  גיל הריון (שבועות)
                </label>
                <select
                  value={gestationalAge}
                  onChange={(e) => setGestationalAge(e.target.value)}
                  className="w-full p-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'left 0.75rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingLeft: '2.5rem'
                  }}
                >
                  <option value="">בחר גיל הריון</option>
                  <option value="35">35 שבועות</option>
                  <option value="36">36 שבועות</option>
                  <option value="37">37 שבועות</option>
                  <option value="38">38 שבועות</option>
                  <option value="39">39 שבועות</option>
                  <option value="40">40 שבועות</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  גיל בשעות מהלידה
                </label>
                <input
                  type="number"
                  min={careSetting === 'Nursery' ? 0 : 1}
                  max="336"
                  value={hoursOfLife}
                  onChange={(e) => setHoursOfLife(e.target.value)}
                  placeholder={careSetting === 'Nursery' ? '0-336 שעות' : '1-336 שעות'}
                  className="w-full p-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                  style={{ MozAppearance: 'textfield' }}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  רמת בילירובין (mg/dL)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={bilirubinLevel}
                  onChange={(e) => setBilirubinLevel(e.target.value)}
                  placeholder="0.0"
                  className="w-full p-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                  style={{ MozAppearance: 'textfield' }}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                />
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={hasRiskFactors}
                    onChange={(e) => setHasRiskFactors(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      {careSetting === 'Nursery'
                        ? 'קיימים גורמי סיכון לצהבת'
                        : 'קיימים גורמי סיכון לנוירוטוקסיות'}
                    </span>
                    <p className="text-xs text-gray-600 mt-1">
                      {careSetting === 'Nursery'
                        ? 'אנמיה המוליטית על רקע אי התאמת סוג דם, חוסר G6PD, ספסיס, אספיקציה, חמצת, היפואלבומינמיה < 3מ"ג/דצ"ל, סכרת הריונית, צפלהמטומה או המטומה נרחבת.'
                        : 'גיל הריון <38 שבועות, אלבומין < 3.0 g/dL, מחלה המוליטית איזואימונית, חסר G6PD, ספסיס, או חוסר יציבות קלינית'}
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Lightbulb className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-800">תוצאות והמלצות</h2>
            </div>

            {results?.error ? (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-red-700">{results.error}</span>
              </div>
            ) : results ? (
              <div className="space-y-6">
                {/* Current Status */}
                <div className={`p-4 rounded-lg border-2 ${
                  results.urgency === 'critical' ? 'bg-red-50 border-red-200' :
                  results.urgency === 'moderate' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-green-50 border-green-200'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    {results.urgency === 'critical' ? (
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    ) : results.urgency === 'moderate' ? (
                      <AlertTriangle className="w-6 h-6 text-yellow-600" />
                    ) : (
                      <Info className="w-6 h-6 text-green-600" />
                    )}
                    <span className={`text-lg font-semibold ${
                      results.urgency === 'critical' ? 'text-red-800' :
                      results.urgency === 'moderate' ? 'text-yellow-800' :
                      'text-green-800'
                    }`}>
                      {results.recommendation}
                    </span>
                  </div>
                </div>

                {/* Thresholds */}
                <div className="grid gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">רף לטיפול באור</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-blue-600">
                        {Number.isFinite(results.photoThreshold) ? results.photoThreshold.toFixed(1) : '—'} mg/dL
                      </span>
                      <span className={`text-sm ${
                        Number.isFinite(results.photoThreshold) && results.bilirubinLevel >= results.photoThreshold
                          ? 'text-red-600 font-semibold' : 'text-gray-600'
                      }`}>
                        {Number.isFinite(results.photoThreshold) && results.bilirubinLevel >= results.photoThreshold ? 'מעל הרף' : 'מתחת לרף'}
                      </span>
                    </div>
                  </div>

                  {careSetting === 'NICU' && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-red-800 mb-2">רף להחלפת דם</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-red-600">
                        {(results as BilirubinResult).exchangeThreshold !== null
                          ? (results as BilirubinResult).exchangeThreshold!.toFixed(1)
                          : '—'} mg/dL
                      </span>
                      <span className={`text-sm ${
                        (results as BilirubinResult).exchangeThreshold !== null &&
                        results.bilirubinLevel >= (results as BilirubinResult).exchangeThreshold!
                          ? 'text-red-600 font-semibold' : 'text-gray-600'
                      }`}>
                        {(results as BilirubinResult).exchangeThreshold !== null &&
                        results.bilirubinLevel >= (results as BilirubinResult).exchangeThreshold!
                          ? 'מעל הרף' : 'מתחת לרף'}
                      </span>
                    </div>
                  </div>
                  )}
                </div>

                {/* Current Bilirubin */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">רמת בילירובין נוכחית</h3>
                  <span className="text-3xl font-bold text-gray-700">
                    {results.bilirubinLevel.toFixed(1)} mg/dL
                  </span>
                </div>

                {/* Copy Button */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={copyToClipboard}
                    className="w-full flex items-center justify-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
                  >
                    {copySuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        הועתק לקליפבורד!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        העתק רפי פוטותרפיה
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>הזן את הנתונים לקבלת המלצות טיפול</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-gray-600">
              {careSetting === 'Nursery' ? (
                <>
                  <p className="font-semibold mb-2">הערות חשובות:</p>
                  <p>מבוסס על מחשבון בילירובין של תינוקיית בילינסון</p>
                </>
              ) : (
                <>
                  <p className="font-semibold mb-2">הערות חשובות:</p>
                  <ul className="space-y-1">
                    <li>• מבוסס על ההנחיות של האקדמיה האמריקאית לרפואת ילדים 2022</li>
                    <li>• מתאים לתינוקות בגילאי הריון 35-40 שבועות</li>
                    <li>• התוצאות מיועדות לסיוע בקבלת החלטות קליניות בלבד</li>
                    <li>• יש להתייעץ עם רופא מומחה לפני קבלת החלטות טיפוליות</li>
                    <li className="mt-3 pt-2 border-t border-gray-200">
                      <strong>מקור:</strong> Kemper, A. R., Newman, T. B., Slaughter, J. L., Maisels, M. J., Watchko, J. F., Downs, S. M., ... &amp; Subcommittee on Hyperbilirubinemia. (2022). Clinical practice guideline revision: Management of hyperbilirubinemia in the newborn infant 35 or more weeks of gestation. <em>Pediatrics</em>, 150(3), e2022058859.
                      <a
                        href="http://publications.aap.org/pediatrics/article-pdf/150/3/e2022058859/1375979/peds_2022058859.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline mr-1"
                      >
                        קישור למאמר המקורי
                      </a>
                    </li>
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BilirubinCalculator;
