

document.addEventListener("DOMContentLoaded", function () {
    
    const transactions = [
        {
            id: 1,
            name: "Sample transaction 1",
            EU: 400,
            class: "unactive"
        },
        {
            id: 2,
            name: "Sample transaction 2",
            EU: 200,
            class: "unactive"
        }
    ];
    let euPlnCounter = 4;

    const renderApp = () => {
        renderTransactions();
        renderSums();
        renderHighest();
    }

    const createTransactionsList = () => {

        let transactionsList = document.createElement('div');
        transactionsList.id = 'transactionsList';
        transactionsListContainer.appendChild(transactionsList);
    }

    const createStatisticPanel = () => {

        let statisticPanel = document.createElement('div');
        statisticPanel.id = 'statisticPanel';
        transactionsListContainer.appendChild(statisticPanel);
    }

    const renderTransactions = () => {

        transactionsList.innerHTML = "Transactions List:";   
        for(var i = 0 ; i < transactions.length ; i ++) {

            let transaction = document.createElement('div');
            transaction.id = i+1;
            transaction.className = "transaction";
            transactions[i].PLN = transactions[i].EU*euPlnCounter;
            transaction.textContent ="Transaction name: "+transactions[i].name+" EU: "+transactions[i].EU.toFixed(2)+" PLN: "+transactions[i].PLN.toFixed(2);
            transaction.onclick = changeActiveState;
            transactionsList.appendChild(transaction);
        }
    }


    const renderSums = () => {

        let recentPlnSum = countSumPln();
        let recentEuSum = countSumEu();     
        let euSumLabel = document.getElementById('euSumLabel');
        let plnSumLabel = document.getElementById('plnSumLabel');
        if(document.getElementById("sumsContainer")==undefined) {
            let sumsContainer = document.createElement('div');
            sumsContainer.id = "sumsContainer";
            statisticPanel.appendChild(sumsContainer);
        }
        sumsContainer.innerHTML = "";
        euSumLabel = document.createElement('p');
        plnSumLabel = document.createElement('p'); 
        euSumLabel.id = "euSumLabel";
        plnSumLabel.id = "plnSumLabel";
        euSumLabel.textContent = "All (Euro): "+recentEuSum.toFixed(2);
        plnSumLabel.textContent = "All (PLN): "+recentPlnSum.toFixed(2);
        sumsContainer.appendChild(euSumLabel);
        sumsContainer.appendChild(plnSumLabel);
    }

    const renderHighest = () => {

        let highestTransactions = findHighest();

        if(document.getElementById("highestTransactionsList")==undefined) {
            let highestTransactionsList = document.createElement('ul');
            highestTransactionsList.id = "highestTransactionsList";
            statisticPanel.appendChild(highestTransactionsList);
        }
        highestTransactionsList.innerHTML = "Highest transactions: "  
        for(var i = 0 ; i < highestTransactions.length ; i++) {

            highestTransactionLabel = document.createElement('li');       
            highestTransactionLabel.id = "highestTransactionLabel"+(i+1);
            highestTransactionLabel.className = "highestTransactionLabels";
            highestTransactionLabel.textContent = "Transaction name: "+highestTransactions[i].name
                                                  +" Euro: "+highestTransactions[i].EU.toFixed(2)
                                                  +" PLN: "+highestTransactions[i].PLN.toFixed(2);    
            highestTransactionsList.appendChild(highestTransactionLabel)
        }     
    }

    const addTransaction = (Event) => {
        Event.preventDefault();
        let transactionName = transactionNameInput.value;
        let transactionAmount = transactionAmountInput.value;
        let modifiedTransactionAmount = transactionAmount.replace(/,/g, '.');
        if(!isNaN(parseFloat(modifiedTransactionAmount))&&isFinite(modifiedTransactionAmount)||modifiedTransactionAmount=="") {
            let parsed = parseFloat(modifiedTransactionAmount);
            isNaN(parsed) ? parsed = 0 : true
            let transaction = {
                id: transactions.length+1,
                EU: parsed,
                name: transactionName,
                class: "unactive"
            }
            transactions.push(transaction);
            transactionAmountInput.style.backgroundColor = 'white';
            transactionAmountInput.value = "";
            transactionNameInput.value = "";
            renderApp();
        }
        else {
            transactionAmountInput.style.backgroundColor = '#F6D8CE';
        }
    }

    const deleteTransaction = (Event) => {
        Event.preventDefault();
        transactions.forEach((t)=> { 
            t.class=="active" ? transactions.splice(t.id-1,1) : true 
        });
        for(var i = 0 ; i < transactions.length ; i++) {
            transactions[i].id = i+1;
        }
        deleteButton.disabled = true;
        renderApp();
    }

    const countSumPln = () => {

        let plnSum = 0;
        for(var i = 0 ; i < transactions.length ; i ++) {
            plnSum += transactions[i].PLN;
        }
        return plnSum;
    }

    const countSumEu = () => {

        let euSum = 0;
        for(var i = 0 ; i < transactions.length ; i ++) {
            euSum += transactions[i].EU;
        }
        return euSum;
    }

    const findHighest = () => {

        let highest = Number.NEGATIVE_INFINITY;
        let current;
        for(var i = 0 ; i < transactions.length ; i++) {
            current = transactions[i].EU;
            current > highest ? highest = current : true ; 
        }
        let highestTransactions = transactions.filter((t)=> { 
            return t.EU==highest
        });
        return highestTransactions;        
    }

    const changeActiveState = (Event) => {

        Event.preventDefault();
        let clicked = Event.target.id; 
        transactions.forEach((t)=>t.class = "unactive");
        transactions[clicked-1].class = "active";
        transactions.forEach((t)=>{
            if(t.class=="active") {
                document.getElementById(t.id).style.backgroundColor="#ECF8E0"; 
                deleteButton.disabled = false;
            }
            else {
            document.getElementById(t.id).style.backgroundColor="white";
            }
        });
    }

    const updateEuPlnCounter = (Event) => {

        Event.preventDefault();
        let euPlnCounterRaw = euPlnCounterInput.value;
        let modifiedCounter = euPlnCounterRaw.replace(/,/g,'.');
        if((!isNaN(euPlnCounter = parseFloat(modifiedCounter))&&isFinite(modifiedCounter))) {
            input.style.backgroundColor = 'white';
            input.value = "";
            renderApp();
        }
        else {
                input.style.backgroundColor = '#F6D8CE';
        }
    }
    
    const transactionsListContainer = document.getElementById("transactionsListContainer");
    createTransactionsList();
    createStatisticPanel();
    
    let euPlnCounterForm = document.getElementById("euPlnCounterForm");
    euPlnCounterForm.onsubmit = updateEuPlnCounter;
    
    const transactionsList = document.getElementById("transactionsList");
    const statisticPanel = document.getElementById("statisticPanel");
    const input = document.getElementById("euPlnCounterInput");
    input.value = "";
    
    const transactionNameInput = document.getElementById("transactionNameInput");
    transactionNameInput.value = "";
    
    const transactionAmountInput = document.getElementById("transactionAmountInput");
    transactionAmountInput.value = "";
    
    const deleteButton = document.getElementById("deleteTransactionButton");
    deleteButton.onclick = deleteTransaction;
    deleteButton.disabled = true;
    
    const transactionsManagerForm = document.getElementById("transactionsManagerForm");
    transactionsManagerForm.onsubmit = addTransaction;
    
    renderApp();

});




