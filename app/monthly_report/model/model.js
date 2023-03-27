const path = require ('path');

class responseData {
    constructor(status = false, code = 400, data = null, totalDriverCost = null, totalDriverIncentive = null, totalDriverExpense = null, totalGrossIncome = null, totalNettIncome = null){
        this.status = status;
        this.code = code;
        this.data = data;
        //this.total_driver_cost = totalDriverCost;
        //this.total_driver_incentive = totalDriverIncentive;
        //this.total_driver_expense = totalDriverExpense;
        //this.total_gross_income = totalGrossIncome;
        //this.total_nett_income = totalNettIncome;
    }
}

module.exports = responseData;