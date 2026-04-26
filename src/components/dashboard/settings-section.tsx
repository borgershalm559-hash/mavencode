"use client";

import { motion } from "framer-motion";
import { PasswordSection } from "./profile/password-section";
import { DeleteAccountSection } from "./profile/delete-account-section";

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export function SettingsSection() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={itemVariants}
      className="space-y-4 max-w-2xl"
    >
      <PasswordSection />
      <DeleteAccountSection />
    </motion.div>
  );
}
