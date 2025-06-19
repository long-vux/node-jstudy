import cron from 'node-cron';
import User from '../database/models/User';

cron.schedule('0 0 * * *', async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const result = await User.deleteMany({
        status: 'pending_deletion',
        deletionRequestedAt: { $lte: thirtyDaysAgo },
    });
    if (result.deletedCount) {
        console.log(`Đã xóa ${result.deletedCount} tài khoản pending_deletion quá 30 ngày`);
    }
});