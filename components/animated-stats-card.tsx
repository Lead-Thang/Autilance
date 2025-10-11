"use client"

import React from "react"
import { LucideIcon } from "lucide-react"

interface StatItem {
  label: string
  value: string
  icon: LucideIcon
}

export function AnimatedStatsCard({ stat }: { stat: StatItem }) {
  const Icon = stat.icon
  
  return (
    <div className="outer w-full h-full">
      <style jsx>{`
        .outer {
          border-radius: 10px;
          padding: 1px;
          background: radial-gradient(circle 230px at 0% 0%, #ffffff, #0c0d0d);
          position: relative;
          min-height: 130px;
        }

        .dot {
          width: 5px;
          aspect-ratio: 1;
          position: absolute;
          background-color: #fff;
          box-shadow: 0 0 10px #ffffff;
          border-radius: 100px;
          z-index: 2;
          right: 10%;
          top: 10%;
          animation: moveDot 6s linear infinite;
        }

        @keyframes moveDot {
          0%,
          100% {
            top: 10%;
            right: 10%;
          }
          25% {
            top: 10%;
            right: calc(100% - 35px);
          }
          50% {
            top: calc(100% - 30px);
            right: calc(100% - 35px);
          }
          75% {
            top: calc(100% - 30px);
            right: 10%;
          }
        }

        .card {
          z-index: 1;
          width: 100%;
          height: 100%;
          border-radius: 9px;
          border: solid 1px #202222;
        border: solid 1px #202222;
        background: radial-gradient(circle 280px at 0% 0%, #444444, #0c0d0d);
        display: flex;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          flex-direction: column;
          color: #fff;
        }
        
        .ray {
          width: 190px;
          height: 15px;
          border-radius: 100px;
          position: absolute;
          background-color: #c7c7c7;
          opacity: 0.4;
          box-shadow: 0 0 50px #fff;
          filter: blur(10px);
          transform-origin: 10%;
          top: 0%;
          right: 30px;
          transform: rotate(40deg);
          transform: rotate(40deg);
        }

        .card .text {
          font-weight: bolder;
          font-size: 1.5rem;
          background: linear-gradient(45deg, #000000 4%, #fff, #000);
          background-clip: text;
          color: transparent;
          text-align: center;
        }

        .line {
          width: 100%;
          height: 1px;
          position: absolute;
          background-color: #2c2c2c;
        }
        
        .topl {
          top: 10%;
          background: linear-gradient(90deg, #888888 30%, #1d1f1f 70%);
        }
        
        .bottoml {
          bottom: 10%;
        }
        
        .leftl {
          left: 10%;
          width: 1px;
          height: 100%;
          background: linear-gradient(180deg, #747474 30%, #222424 70%);
        }
        
        .rightl {
          right: 10%;
          width: 1px;
          height: 100%;
        }
        
        .label {
          margin-top: 10px;
          font-size: 0.85rem;
          color: #ccc;
          text-align: center;
        }
        
        .icon-container {
          margin-bottom: 3px;
        }
      `}</style>
      
      <div className="dot"></div>
      <div className="card">
        <div className="ray"></div>
        <div className="line topl"></div>
        <div className="line bottoml"></div>
        <div className="line leftl"></div>
        <div className="line rightl"></div>
        <div className="icon-container">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text">{stat.value}</div>
        <div className="label">{stat.label}</div>
      </div>
    </div>
  )
}