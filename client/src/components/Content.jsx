import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Spline from '@splinetool/react-spline';

export default function Content() {
    return (
        <Stack
            sx={{
                flexDirection: 'column',
                alignSelf: 'center',
                gap: 4,
                maxWidth: 450,
                width: '100%',
                height: '500px'
            }}
        >
            <Spline
                scene="https://prod.spline.design/vi-h88jX1pGoyilb/scene.splinecode"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    outline: 'none',
                    border: '2px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
                }}
            />
        </Stack>
    );
}
