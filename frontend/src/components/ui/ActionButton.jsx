import { motion } from 'framer-motion'

const baseClassName =
  'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'

function ActionButton({ className = '', children, ...props }) {
  return (
    <motion.button
      className={`${baseClassName} ${className}`.trim()}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default ActionButton
