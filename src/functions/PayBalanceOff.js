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
        const futureDate = new Date(deadline);

        const validFrequency = [ 'D', 'W', 'OW'];

        const isValidDate = (dateString) => {
            const date = new Date(dateString);
            return !isNaN(date.getTime());
        }

        //check that the values are valid
        if((isNaN(balance) || balance <= 0) ||
        dayOfWeek >= 0 && dayOfWeek <= 6 ||
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
                    const numDays = differenceMs/86400000;

                    installment = parseFloat((balance/numDays).toFixed(2)); //12.00
                    break;
                case 'W':
                    const occurences_w = 0;

                    for(let date = currentDate; date <= futureDate; date.setDate(date.getDate() + 1)) {
                        if(date.getDay() === dayOfWeek) {
                            occurences_w++;
                        }
                    }

                    installment = parseFloat((balance/occurences_w).toFixed(2));
                    break;
                case 'OW':
                    const occurences_ow = 0;

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
