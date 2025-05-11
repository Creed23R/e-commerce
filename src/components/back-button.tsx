'use client'

import React from 'react'
import { Button } from './ui/button'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation';

export default function BackButton() {

    const router = useRouter();

    return (
        <Button onClick={router.back} size='icon' variant='outline' >
            <ChevronLeft className="h-5 w-5" />
        </Button>
    )
}
