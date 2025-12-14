'use client'

import React, { useMemo } from 'react'
import clsx from 'clsx';
import randomColor from 'randomcolor';
export default function Strips({ className, stripConut = 3, height = 4 }: {
    className?: string;
    stripConut?: number;
    height: number;
}) {
    const stripes = useMemo(() => {
    return Array.from({ length: stripConut }).map(() => {
      const from = randomColor({ luminosity: 'dark', format: 'rgba' });
      const to = randomColor({ luminosity: 'dark', format: 'rgba' });
      return { from, to };
    });
  }, [stripConut]);
    return (
        <div className={clsx("flex flex-col  ", className)}>

            {stripes.map(({from ,to}, index) => {
                return (
                    <div
                        key={`${index}-${to}`}
                        className="w-full bg-animated-stripe animate-gradient-shift"
                        style={
                            {
                                '--from': from,
                                '--to': to,
                                height: `${height}rem`
                            } as React.CSSProperties
                        }
                    ></div>
                )
            })}

        </div>
    )
}
