const storageCtrl = (function(){
  return {
    storeItem: function(item){
      let proracuni;
      if(localStorage.getItem('proracuni') === null){
        proracuni = [];
        proracuni.push(item);
        localStorage.setItem('proracuni', JSON.stringify(proracuni));
      }
      else{
        proracuni = JSON.parse(localStorage.getItem('proracuni'));
        proracuni.push(item);
        localStorage.setItem('proracuni', JSON.stringify(proracuni));
      }
    },
    storeItem2: function(item){
      let proracuni2;
      if(localStorage.getItem('proracuni2') === null){
        proracuni2 = [];
        proracuni2.push(item);
        localStorage.setItem('proracuni2', JSON.stringify(proracuni2));
      }
      else{
        proracuni2 = JSON.parse(localStorage.getItem('proracuni2'));
        proracuni2.push(item);
        localStorage.setItem('proracuni2', JSON.stringify(proracuni2));
      }
    },
    getFromStorage: function(){
      let proracuni;
      if(localStorage.getItem('proracuni') === null){
        proracuni = [];
      }
      else{
        proracuni = JSON.parse(localStorage.getItem('proracuni'));
      }
      return proracuni;
    },
    getFromStorage2: function(){
      let proracuni2;
      if(localStorage.getItem('proracuni2') === null){
        proracuni2 = [];
      }
      else{
        proracuni2 = JSON.parse(localStorage.getItem('proracuni2'));
      }
      return proracuni2;
    },
    deleteFromStorage: function(id){
      let proracuni = JSON.parse(localStorage.getItem('proracuni'));
      proracuni.forEach(function(item, index){
        if(id === item.id){
          proracuni.splice(index, 1);
        }
      });
      localStorage.setItem('proracuni', JSON.stringify(proracuni));
    },
    deleteFromStorage2: function(id){
      let proracuni2 = JSON.parse(localStorage.getItem('proracuni2'));
      proracuni2.forEach(function(item, index){
        if(id === item.id){
          proracuni2.splice(index, 1);
        }
      });
      localStorage.setItem('proracuni2', JSON.stringify(proracuni2));
    },
    getTotalsExp: function(){
      let proracuni;
      if(localStorage.getItem('proracuni') === null){
        proracuni = [];
      }
      else{
        proracuni = JSON.parse(localStorage.getItem('proracuni'));
      }
      let sum = 0;
      proracuni.forEach(function(current){
        sum+= current.value;
      })
      return sum;
    },
    getTotalsInc: function(){
      let proracuni2;
      if(localStorage.getItem('proracuni2') === null){
        proracuni = [];
      }
      else{
        proracuni2 = JSON.parse(localStorage.getItem('proracuni2'));
      }
      let sum = 0;
      proracuni2.forEach(function(current){
        sum+= current.value;
      })
      return sum;
    },
    getTotalsBudget: function(){
      return storageCtrl.getTotalsInc() - storageCtrl.getTotalsExp();
    }
  };
})();

const budgetCtrl = (function(){
  let Expense = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
  };
  let Income = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
  };
  let calculateTotal = function(type){
    let sum = 0;
    data.allItems[type].forEach(function(current){
      sum+=current.value;
    });
    data.totals[type] = sum;
  };
  let data = {
    allItems:{
      exp: storageCtrl.getFromStorage(),
      inc: storageCtrl.getFromStorage2()
    },
    totals:{
      exp:storageCtrl.getTotalsExp(),
      inc:storageCtrl.getTotalsInc()
    },
     budget:storageCtrl.getTotalsBudget()
  };
  return{
    getItems: function(){
      return data.allItems;
    },
    getBudgety: function(){
      return data.budget;
    },
    addItem: function(type, desc, value){
      let newItem, ID, val,newID;
      if(data.allItems[type].length > 0){
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      }
      else{
        ID = 0;
      }
      if(type === 'exp'){
        // let val = '-'+value;
        newItem = new Expense(ID,desc, value);
      }
      else if(type === 'inc'){
        newItem = new Income(ID, desc, value);
      }
      data.allItems[type].push(newItem);
      return newItem;
    },
    deleteItem: function(type, id){
      let ids, index;
      ids = data.allItems[type].map(function(curr){
        return curr.id;
      });
      index = ids.indexOf(id);
      if(index !== -1){
        data.allItems[type].splice(index,1);
      }
    },
    calculateBudget: function(){
      calculateTotal('exp');
      calculateTotal('inc');
      data.budget = data.totals.inc - data.totals.exp;
    },
    getBudget: function(){
      return{
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp
      };
    },
    testing: function(){
      console.log(data);
    }
  };
})();

const UICtrl = (function(){
  let DOMstrings = {
    inputType: '.addType',
    inputDesc: '.descInput',
    inputValue: '.numInput',
    inputBtn: '.btnInput',
    incomeContainer: '.incomeContainer',
    expensesContainer: '.expensesContainer',
    totalBudget: '#totalBudget',
    incomeBudget: '.incomeBudget',
    expensesBudget: '.expensesBudget'
  };
  let formatNumber = function(num, type){
    let numSplit, int, dec;
    num = Math.abs(num);
    num = num.toFixed(2);
    numSplit = num.split('.');
    int = numSplit[0];
    if(int.length > 3){
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
    }
    dec = numSplit[1];
    return(type === 'exp' ? '-' : '+') + ' '+ int + '.' + dec;
  };
  let capitalize = function capitalize(s){
    return s[0].toUpperCase() + s.slice(1);
  }
  return{
    formatPlusMinus: function(num){
      type === 'inc' ? num ='+' + num : num = '-' + num;
      return num;
      // console.log(num);
    },
    populateItemList: function(proracuni, type){
      let output, type2,element;
      output = '';
      if(type === 'exp'){
        type2 = '.expensesBudget';
        element = DOMstrings.expensesContainer;
      }
      else{
        type2 = '.incomeBudget';
        element = DOMstrings.incomeContainer;
      }
      if(type === 'exp'){
        proracuni.forEach(function(current){
            output += `
            <div class="row itemsDiv" id="exp-${current.id}">
              <div class="col-sm-6 col-md-6">
                <div class="itemDesc">${capitalize(current.description)}</div>
              </div>
              <div class="col-sm-4 col-md-4">
                <div class="itemValue highlightRed ${type2}">${formatNumber(current.value, 'exp')}</div>
              </div>
              <div class="col-sm-2 col-md-2 active">
                <button class="itemDeleteBtn highlightRed"><i class="ion-ios-close-outline"></i></button>
              </div>
            </div>
            `;
        });
      }
      else{
        proracuni.forEach(function(current){
            output += `
            <div class="row itemsDiv" id="inc-${current.id}">
              <div class="col-sm-6 col-md-6">
                <div class="itemDesc">${capitalize(current.description)}</div>
              </div>
              <div class="col-sm-4 col-md-4">
                <div class="itemValue highlightGreen ${type2}">${formatNumber(current.value, 'inc')}</div>
              </div>
              <div class="col-sm-2 col-md-2 active">
                <button class="itemDeleteBtn highlightGreen"><i class="ion-ios-close-outline"></i></button>
              </div>
            </div>
            `;
        });
      }
        document.querySelector(element).insertAdjacentHTML('beforeend', output);
    },
    showAlert: function(type, type3){
      let output, color,message, type2;
      if(type === 'inc'){
        type2 = 'added income';
        if(type3 === 'add'){
          type2 = 'added income';
        }
        else if(type3 === 'delete'){
          type2 = 'removed income';
        }
      }
      if(type === 'exp'){
        type2 = 'added expense';
        if(type3 === 'add'){
          type2 = 'added expense';
        }
        else if(type3 === 'delete'){
          type2 = 'removed expense';
        }
      }
      message = `<strong>Well done!</strong> You successfully ${type2}.`
      output = `<div class="alert alert-success text-center cutted" role="alert">
                ${message} </div>`
      document.querySelector('.addAlert').innerHTML = output;
      setTimeout(function() {
        document.querySelector('.alert').remove();
      }, 1500);
    },
    getInputs: function(){
      return{
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDesc).value,
        value:parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },
    getDOMstrings: function(){
      return DOMstrings;
    },
    addListItem: function(obj, type){
      let output, element;
      if(type === 'inc'){
        element = DOMstrings.incomeContainer;
        output = `
        <div class="row itemsDiv" id="inc-${obj.id}">
          <div class="col-sm-6 col-md-6">
            <div class="itemDesc">${capitalize(obj.description)}</div>
          </div>
          <div class="col-sm-4 col-md-4">
            <div class="itemValue highlightGreen incomeBudget">${formatNumber(obj.value, 'inc')}</div>
          </div>
          <div class="col-sm-2 col-md-2 active">
            <button class="itemDeleteBtn highlightGreen"><i class="ion-ios-close-outline"></i></button>
          </div>
        </div>
        `
      }
      else if(type === 'exp'){
        element = DOMstrings.expensesContainer;
        output = `
        <div class="row itemsDiv" id=exp-${obj.id}>
          <div class="col-sm-6 col-md-6">
            <div class="itemDesc">${capitalize(obj.description)}</div>
          </div>
          <div class="col-sm-4 col-md-4">
            <div class="itemValue highlightRed expensesBudget">${formatNumber(obj.value, 'exp')}</div>
          </div>
          <div class="col-sm-2 col-md-2">
            <button class="itemDeleteBtn highlightRed"><i class="ion-ios-close-outline"></i></button>
          </div>
        </div>
        `;
      }
      document.querySelector(element).insertAdjacentHTML('beforeend', output);
    },
    deleteListItem: function(selectorID){
      let element = document.getElementById(selectorID);
      element.parentNode.removeChild(element);
    },
    clearFields: function(){
      let fields;
      fields = document.querySelectorAll('input');
      fields.forEach(function(current){
        current.value = '';
      });
      fields[0].focus();
    },
    displayBudget: function(obj){
      let type;
      obj.budget > 0 ? type = 'inc' : type = 'exp';
      // console.log(obj.budget, parseFloat(formatNumber(obj.totalInc, 'inc')), parseFloat(formatNumber(obj.totalExp, 'exp')));

      document.querySelector(DOMstrings.totalBudget).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMstrings.incomeBudget).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMstrings.expensesBudget).textContent = formatNumber(obj.totalExp, 'exp');
    },
    changeType: function(){
      let fields = document.querySelectorAll(DOMstrings.inputType +','+DOMstrings.inputDesc+','+DOMstrings.inputValue);
      fields.forEach(function(current){
        current.classList.toggle('red-focus');
      });
      document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
    }
  }
})();

const controller = (function(budgetCtrl, UICtrl, storageCtrl){
  let setupEventListeners = function(){
    let DOM = UICtrl.getDOMstrings();
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function(e){
      if(e.keyCode === 13 || e.which === 13){
        ctrlAddItem();
      }
    });
    document.querySelector('.container').addEventListener('click', ctrlDeleteItem);
    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
  };
  let updateBudget = function(){
    budgetCtrl.calculateBudget();
    let budget = budgetCtrl.getBudget();
    UICtrl.displayBudget(budget);
  }
  let ctrlAddItem = function(){
    let input, newItem;
    input = UICtrl.getInputs();
    if(input.description !== '' && !isNaN(input.value) && input.value > 0){
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      UICtrl.addListItem(newItem, input.type);
      UICtrl.showAlert(input.type, 'add');
      UICtrl.clearFields();
      // let temp = UICtrl.formatPlusMinus(input.value, input.type);
      // console.log(temp);
      if(input.type === 'inc'){
        storageCtrl.storeItem2(newItem);
      }
      else if(input.type === 'exp'){
        storageCtrl.storeItem(newItem);
      }
      updateBudget();
    }
  };
  let ctrlDeleteItem = function(e){
    let itemID, splitID,type,ID;
    itemID = e.target.parentNode.parentNode.parentNode.id;
    if(itemID){
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);
      budgetCtrl.deleteItem(type,ID);
      UICtrl.deleteListItem(itemID);
      let a;
      splitID[0] === 'inc' ? a = 'inc' : a = 'exp';
      // console.log(itemID);
      // console.log(a);
      UICtrl.showAlert(a, 'delete');
      if(type === 'exp'){
        storageCtrl.deleteFromStorage(ID);
      }
      else if(type === 'inc'){
        storageCtrl.deleteFromStorage2(ID);
      }
      updateBudget();
    }
  };
  return{
    init:function(){
      let a = budgetCtrl.getItems();
      // console.log(a);
      let b = budgetCtrl.getBudgety();
      // console.log(b);

      if(a.exp.length !== 0){
          // console.log(a.exp);
          UICtrl.populateItemList(a.exp, 'exp');
      }
      if(a.inc.length !== 0){
          // console.log(a.inc);
          UICtrl.populateItemList(a.inc, 'inc');
      }
      UICtrl.displayBudget({
        budget:storageCtrl.getTotalsBudget(),
        totalInc:storageCtrl.getTotalsInc(),
        totalExp:storageCtrl.getTotalsExp()
      });
      setupEventListeners();
    }
  };
})(budgetCtrl, UICtrl, storageCtrl);
controller.init();
