"use client";

import { useEffect } from "react";

export function ErrorLogger() {
  useEffect(() => {
    // 添加全局错误监听器
    const handleErrors = (e: ErrorEvent) => {
      console.error("Global error:", e.message, e.filename, e.lineno, e.colno, e.error);
      if (e.error?.message.includes("__dirname")) {
        console.error("Specific __dirname error detected:", {
          message: e.error.message,
          stack: e.error.stack,
          filename: e.filename,
          lineno: e.lineno,
          colno: e.colno
        });
      }
      return true; // 返回 true 以阻止默认处理程序
    };

    // 添加全局未处理的 promise rejection 监听器
    const handleRejections = (e: PromiseRejectionEvent) => {
      console.error("Promise rejection:", e.reason);
      if (e.reason?.message?.includes("__dirname")) {
        console.error("Specific __dirname promise rejection:", {
          message: e.reason.message,
          stack: e.reason.stack
        });
      }
      return true; // 返回 true 以阻止默认处理程序
    };

    // React 的错误边界无法在 Server Components 中使用，所以使用全局监听器
    window.addEventListener("error", handleErrors);
    window.addEventListener("unhandledrejection", handleRejections);

    // 清理函数
    return () => {
      window.removeEventListener("error", handleErrors);
      window.removeEventListener("unhandledrejection", handleRejections);
    };
  }, []);

  return null; // This component doesn't render anything
}