"use client"
import React, { useEffect, useState, useRef } from 'react'
import { Pause } from 'lucide-react';
import { Play } from 'lucide-react';
import { Volume2 } from 'lucide-react';
import { VolumeOff } from 'lucide-react';

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import clsx from 'clsx';
import { Button } from './ui/button';
import { Slider } from './ui/slider';

interface VidPlayerProps {
    videoData: string,
    autoplay: boolean,
    className?: string;
    deBug?: boolean;
    size?: "default" | "lg" | "xl" | "2xl"
}
interface VideoInfo {
    title: string;
    durationMax: number;
    videoData: string;
    currentTime: number;
    isPlaying: boolean;
    volume: number;
    fullscreen: boolean;
}
export default function VidPlayer({ videoData, autoplay, className, deBug , size = "default" }: VidPlayerProps) {
    // const [isMounted, setIsMounted] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null)
    const [videoInfo, setVideoInfo] = useState<VideoInfo>({
        title: '',
        durationMax: 0,
        videoData: '',
        currentTime: 0,
        isPlaying: false,
        volume: 1,
        fullscreen: false
    })

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.src = videoData
        }
    }, [videoData])

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = videoInfo.volume
            if (videoInfo.isPlaying) {
                videoRef.current.play()
            } else {
                videoRef.current.pause()
            }
        }
    }, [videoInfo.isPlaying, videoInfo.volume])

    function PlayVid() {
        setVideoInfo((prevInfo) => ({
            ...prevInfo,
            isPlaying: prevInfo.isPlaying ? false : true
        }))
    }

    function formatTime(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function getSizeClasses(size: "default"  | "lg" | "xl" | "2xl") {
        switch (size) {
        
            case "lg":
                return "w-[640px] h-[360px]";
            case "xl":
                return "w-[1280px] h-[720px]";
            case "2xl":
                return "w-[1920px] h-[1080px]";
            default:
                return "w-[520px] h-[360px]";
        }
    }

    return (
        <div
            className={clsx(
                "relative overflow-hidden rounded-3xl ring-1 ring-slate-900/10 dark:ring-white/10",
                "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950",
                getSizeClasses(size),
                className
            )}
        >
            <div className="absolute inset-0 -z-10">
                <span className="vp-blob vp-blob-a"></span>
                <span className="vp-blob vp-blob-b"></span>
                <span className="vp-blob vp-blob-c"></span>
            </div>

            {!videoInfo.isPlaying && (
                <div onClick={() => PlayVid()} className="absolute z-[10] inset-0 grid place-items-center bg-black/20 backdrop-blur-md">
                    <span className=" text-3xl tracking-wider bg-gradient-to-r from-sky-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">Play</span>
                </div>
            )}

            {deBug && (
                <div className="absolute left-3 top-3 z-[100] rounded-2xl border border-white/20 bg-slate-900/70 p-3 text-xs text-slate-100 shadow-lg backdrop-blur-xl">
                    <h1 className="font-semibold text-slate-100">Debug</h1>
                    <p>Current Time: {videoInfo.currentTime}</p>
                    <p>Duration: {videoInfo.durationMax}</p>
                    <p>Volume: {videoInfo.volume}</p>
                    <p>Fullscreen: {videoInfo.fullscreen ? 'Yes' : 'No'}</p>
                    <p className="truncate">Video Data: {videoInfo.videoData}</p>
                    <p>isPlaying: {videoInfo.isPlaying ? 'Yes' : 'No'}</p>
                </div>
            )}
               
            <video
                className="absolute top-0 left-0 h-full w-full object-fill rounded-[inherit] bg-black/40"
                key={videoData}
                ref={videoRef}
                controls={false}
                autoPlay={autoplay}
                
                loop={false}
                playsInline
                preload="auto"
                onClick={() => {
                    if (!videoRef.current) return;
                    setVideoInfo((prevInfo) => ({
                        ...prevInfo,
                        isPlaying: !prevInfo.isPlaying
                    }));
                }}
                onLoadedMetadata={() => {
                    if (!videoRef.current) return;
                    setVideoInfo({
                        title: videoRef.current.title,
                        durationMax: videoRef.current.duration,
                        videoData: videoRef.current.src,
                        currentTime: videoRef.current.currentTime,
                        isPlaying: false,
                        volume: videoRef.current.volume,
                        fullscreen: false
                    })
                }}
                onTimeUpdate={() => {
                    if (!videoRef.current) return;
                    setVideoInfo((prevInfo) => ({
                        ...prevInfo,
                        currentTime: videoRef.current?.currentTime || 0
                    }))
                }}
            />

            <div className='absolute z-50 bottom-4 left-4 right-4 h-12 w-auto p-3 rounded-2xl border border-white/15 bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl flex flex-row gap-3 items-center shadow-2xl'>
                <Button variant="ghost" onClick={() => PlayVid()} className="h-10 w-10 rounded-xl hover:scale-105 transition">
                    {videoInfo.isPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7" />}
                </Button>

                <HoverCard>
                    <HoverCardTrigger>
                        <Button variant="ghost" className="h-10 w-10 rounded-xl hover:scale-105 transition">
                            {videoInfo.volume === 0 ? (
                                <VolumeOff className="h-7 w-7" />
                            ) : (
                                <Volume2 className="h-7 w-7" />
                            )}
                        </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="rounded-2xl border border-white/15 bg-white/10 dark:bg-slate-900/60 backdrop-blur-xl shadow-xl">
                        <Slider
                            defaultValue={[videoInfo.volume]}
                            className='w-[220px]'
                            value={[videoInfo.volume]}
                            max={1}
                            step={0.1}
                            min={0}
                            onValueChange={(value) => {
                                setVideoInfo((prevInfo) => ({
                                    ...prevInfo,
                                    volume: value[0]
                                }))
                            }}
                            minStepsBetweenThumbs={0.1}
                        />
                    </HoverCardContent>
                </HoverCard>

                <div className="px-2">
                    <p className='text-sm font-bold bg-gradient-to-r from-sky-400 via-violet-400 to-pink-400 bg-clip-text text-transparent'>
                        {formatTime(videoInfo.currentTime)} / {formatTime(videoInfo.durationMax)}
                    </p>
                </div>

                <div className='flex flex-row items-center justify-center gap-2 flex-1'>
                    <Slider
                        defaultValue={[videoInfo.currentTime]}
                        value={[videoInfo.currentTime]}
                        max={videoInfo.durationMax}
                        step={0.001}
                        min={0}
                        onValueChange={(value) => {
                            if (!videoRef.current) return;
                            videoRef.current.currentTime = value[0]
                            setVideoInfo((prevInfo) => ({
                                ...prevInfo,
                                currentTime: value[0]
                            }))
                        }}
                        className="w-full"
                    />
                </div>
            </div>

            <style>{`
                @keyframes vp-float-a { 
                    0%,100% { transform: translate3d(-12%, -8%, 0) scale(1); }
                    50% { transform: translate3d(10%, 8%, 0) scale(1.15); }
                }
                @keyframes vp-float-b { 
                    0%,100% { transform: translate3d(16%, 12%, 0) scale(1.05); }
                    50% { transform: translate3d(-6%, -10%, 0) scale(0.95); }
                }
                @keyframes vp-float-c { 
                    0%,100% { transform: translate3d(-10%, 16%, 0) scale(1.1); }
                    50% { transform: translate3d(8%, -12%, 0) scale(1.22); }
                }
                .vp-blob{
                    position:absolute; width:46%; height:46%; border-radius:9999px; filter:blur(42px);
                    opacity:.35; mix-blend:screen;
                    background: radial-gradient(60% 60% at 50% 50%, hsl(204 94% 68% / .8), transparent 70%),
                                radial-gradient(60% 60% at 60% 40%, hsl(258 90% 75% / .8), transparent 70%),
                                radial-gradient(60% 60% at 40% 60%, hsl(330 92% 70% / .8), transparent 70%);
                }
                .dark .vp-blob{ opacity:.28; }
                .vp-blob-a{ left:-12%; top:-14%; animation: vp-float-a 20s ease-in-out infinite; }
                .vp-blob-b{ right:-10%; top:12%; animation: vp-float-b 24s ease-in-out infinite; }
                .vp-blob-c{ left:8%; bottom:-14%; animation: vp-float-c 26s ease-in-out infinite; }
            `}</style>
        </div>
    )
}
