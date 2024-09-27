"use client"

import { ReactNode } from 'react';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers';

const LocalizationProviderContainer = ({ children }: { children: ReactNode }) => (
    <LocalizationProvider dateAdapter={AdapterMoment}>
        { children }
    </LocalizationProvider>
)

export default LocalizationProviderContainer