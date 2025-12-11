"use client"
import React, { useState } from 'react'
import InputBox from './InputBox';
import clsx from 'clsx';
import { Button } from './ui/button';
import { ScanSearch } from 'lucide-react';

interface InputBtuProps {
    onSubmit: (value: string) => void;
    className?: string;
    icon?: React.ReactNode | string;
    disabled?: boolean;
}

export default function InputBtu({  onSubmit, className  , icon ,disabled }: InputBtuProps) {
    const [value, setValue] = useState<string>("");

  return (
    <div className={clsx("flex flex-row gap-1.5 items-center ", className)}>
        <InputBox
            value={value}
            className='flex-1 w-full'
            onChange={setValue}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    onSubmit(value);
                    setValue("");
                }
            }}
            placeholder="Type and press Enter"
            disabled={disabled}
          
        />
        <Button
            onClick={() => {
                onSubmit(value);
                setValue("");
            }}
            disabled={disabled}
            variant={"outline"}
            size={ typeof icon === "string" ? "default" : "icon"}
            
        >
            {icon || <ScanSearch className="h-4 w-4" />}

        </Button>
        
    </div>
  )
}
