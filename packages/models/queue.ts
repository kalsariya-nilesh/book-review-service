import { Queue } from 'bullmq';
import { connection } from './redis';

export const reviewQueue = new Queue('reviewQueue', { connection });
