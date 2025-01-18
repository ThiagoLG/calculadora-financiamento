import { NumberFormatter } from '@/shared/utils/number-formatter';
import styles from './payment-summary.module.scss';
import { motion } from 'motion/react';

interface PaymentSummaryItemProps {
  title: string;
  value: number;
}

export function PaymentSummaryItem({ title, value }: PaymentSummaryItemProps) {
  const variants = {
    hidden: { y: -100, opacity: 0, scale: 0 },
    show: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        y: {
          stiffness: 1000,
          velocity: -100,
          transition: {
            y: { stiffness: 1000 }
          }
        }
      }
    }
  };
  return (
    <motion.li variants={variants}>
      <span className={styles.description}>{title}</span>
      <span className={styles.value}>{NumberFormatter.formatCurrency(value)}</span>
    </motion.li>
  );
}
