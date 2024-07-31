const { app } = require('@azure/functions');

app.http('PayBalanceOff', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {

        const balance = parseInt(request.query.get('balance'));
        const dueDate = request.query.get('deadline'); //yyyy-mm-dd
        const frequency = request.query.get('frequency');
        const dayOfWeek = parseInt(request.query.get('day'));

        const currentDate = new Date();
        const futureDate = new Date(dueDate);
        let installment = 0;

        const validFrequency = ['D', 'W', 'OW'];

        const isValidDate = (dateString) => {
            const date = new Date(dateString);
            return !isNaN(date.getTime());
        }
        console.log(dayOfWeek);

        //check that the values are valid
        if((isNaN(balance) || balance <= 0) ||
        (isNaN(dayOfWeek) || !(dayOfWeek >= 0 && dayOfWeek <= 6)) ||
        !validFrequency.includes(frequency) ||
        !isValidDate(dueDate)
        ) {
            return {
                status: 400,
                body: 'Provide valid information'
            }
        } else {
            switch(frequency){
                case 'D':
                    const differenceMs = futureDate - currentDate;
                    const numDays = Math.round(differenceMs/86400000);
    
                    installment = parseFloat((balance/numDays).toFixed(2)); //12.00
                    break;
                case 'W':
                    let occurences_w = 0;

                    for(let date = currentDate; date <= futureDate; date.setDate(date.getDate() + 1)) {
                        if(date.getDay() === dayOfWeek) {
                            occurences_w++;
                        }
                    }

                    installment = parseFloat((balance/occurences_w).toFixed(2));
                    break;
                case 'OW':
                    let occurences_ow = 0;

                    for(let date = currentDate; date <= futureDate; date.setDate(date.getDate() + 1)) {
                        if(date.getDay() === dayOfWeek) {
                            occurences_ow++;
                        }
                    }

                    installment = parseFloat((balance/Math.round(occurences_ow/2)).toFixed(2));
            }

            return {
                body: installment
            }
        }        
    }
});
