const path = require ('path');
const reportRepo = require(path.resolve('app/monthly_report/repositories/report_repositories'))

exports.monthlyReport = async (data) => {
    try{
        
        data.totalDriverExpense = data.totalDriverCost + data.totalDriverIncentive;

        data.totalGrossIncome = data.totalCost - data.discount + data.totalDriverCost;

        data.totalNettIncome = data.totalCost - data.discount + data.totalDriverCost - data.totalDriverIncentive;

        console.log(data.totalDriverCost);

        let result = {
            totalDriverCost: data.totalDriverCost,
            totalDriverIncentive: data.totalDriverIncentive,
            totalDriverExpense: data.totalDriverExpense,
            totalGrossIncome: data.totalGrossIncome,
            totalNettIncome: data.totalNettIncome
        };

        //return [data.totalDriverCost, data.totalDriverIncentive, data.totalDriverExpense, data.totalGrossIncome, data.totalNettIncome];
        return result;
        /* return  [
            `totalDriverCost: ${data.totalDriverCost}`,
            `totalDriverIncentive: ${data.totalDriverIncentive}`,
            `totalDriverExpense: ${data.totalDriverExpense}`,
            `totalGrossIncome: ${data.totalGrossIncome}`,
            `totalNettIncome: ${data.totalNettIncome}`
                ] */

    }catch(err){
        throw new Error(err);
    }
}

exports.bookingActivity = async (data) => {
    try{
        let result = await reportRepo.getBookingActivity(data);
        return result;
    }catch(err){
        throw new Error(err);
    }
}

exports.driverActivity = async (data) => {
    try{
        let result = await reportRepo.getDriverActivity(data);
        return result;
    }catch(err){
        throw new Error(err);
    }
}

exports.totalDriverCost = async (data) => {
    try{
        let result = await reportRepo.totalDriverCost(data);
        return result;
    }catch(err){
        throw new Error(err);
    }
}

exports.totalDriverIncentive = async (data) => {
    try{
        let result = await reportRepo.totalDriverIncentive(data);
        return result;
    }catch(err){
        throw new Error(err);
    }
}

exports.totalDriverExpense = async (data) => {
    try{
        let result = await reportRepo.totalDriverExpense(data);
        return result;
    }catch(err){
        throw new Error(err);
    }
}

exports.totalGrossIncome = async (data) => {
    try{
        let result = await reportRepo.totalGrossIncome(data);
        return result;
    }catch(err){
        throw new Error(err);
    }
}

exports.totalNettIncome = async (data) => {
    try{
        let result = await reportRepo.totalNettIncome(data);
        return result;
    }catch(err){
        throw new Error(err);
    }
}