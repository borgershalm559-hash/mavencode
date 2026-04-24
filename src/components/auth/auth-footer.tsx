"use client";

import { motion } from "framer-motion";

interface AuthFooterProps {
  activeTab: "login" | "register";
  onTabChange: (tab: "login" | "register") => void;
}

export function AuthFooter({ activeTab, onTabChange }: AuthFooterProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="mt-8 pt-6 border-t border-white/[0.08] text-center"
    >
      <p className="text-sm text-white/35">
        {activeTab === "login"
          ? "Нет аккаунта? "
          : "Уже есть аккаунт? "}
        <button
          onClick={() => onTabChange(activeTab === "login" ? "register" : "login")}
          className="text-[#10B981]/60 hover:text-[#10B981] transition-colors duration-200 font-medium"
        >
          {activeTab === "login" ? "Зарегистрироваться" : "Войти"}
        </button>
      </p>
    </motion.div>
  );
}
