"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import React from "react";

const PageWrapper = (props: HTMLMotionProps<"div">) => {
  return (
    <div>
      <motion.div
        {...props}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
      />
    </div>
  );
};

export default PageWrapper;
