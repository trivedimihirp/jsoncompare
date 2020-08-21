import React, { useState } from 'react';
import TableComponent from './TableComponent';


import './App.css';

function App() {
  
  let _cfxFullData = null;
  let _developerResult1 = null;
  let _developerResult2 = null;

  let [devTestsToTriage, setDevTestsToTriage] = useState([]); 

  function getTestStaus( jsonData ){
    let testDetails = []
    let index = 0;
    for( let featureIndex in jsonData.data ){
     let feature = jsonData.data[featureIndex];
     let featureName = feature.name;

     for( let scenarioIndex in feature.scenarios){
       let scenario = feature.scenarios[scenarioIndex];
       let scenarioName = scenario.name;
       let testDetail = {
         index: index++,
        featureName: featureName,
        scenarioName: scenarioName,
        status: 'PASSED',
        fileName: feature.uri,
        tags: feature.tags
       }
       for( let stepIndex in scenario.steps ){
         let step = scenario.steps[stepIndex];
         testDetail.stepName =   step.name;
         testDetail.errormessage = '';
         if(step.result.status==='failed'){
          testDetail.status = 'FAILED';
          //testDetail.errormessage = step.result.error_message;
          break;
          }
       }
       testDetails.push(testDetail);
     }
   }
    return testDetails;
  }

  function getFailedTests ( allTests ){
    let failedTests = allTests.filter(function( test ) {
      if( test.status === 'FAILED' ){
        return true;
      };
      return false;
    });
    return failedTests;
  }

  function updateTestStatus( actualTests, failedTests, checkStatus ){
    //Find Failed Test in actualTest
    for( let failedIndex = 0 ; failedIndex < failedTests.length; failedIndex++ ){
      let failedTest =   failedTests[failedIndex];
      //console.log( 'Failed TEST-->', failedTest.scenarioName);
      for( let actualIndex = 0; actualIndex< actualTests.length; actualIndex++){
          let actualTest = actualTests[ actualIndex];
          //console.log( 'Actual TEST-->', actualTest.scenarioName);
          if(  failedTest.featureName === actualTest.featureName && 
            failedTest.scenarioName === actualTest.scenarioName   ){
              if( checkStatus === 'PASSED' && actualTest.status === 'PASSED'){
                //Dev to Dev compare case
                failedTest.status = 'PASSED IN DIFFERENT RUN';
              }
              if( checkStatus === 'FAILED' && failedTest.stepName === actualTest.stepName && actualTest.status === 'FAILED'){
                //CFx hourly compare case
                failedTest.status = 'FAILED AS BASE LINE';
              }
            }
        }  
    }

  }

  function compareResults() {
     let dev1FailedTests = null; 
     let dev2FailedTests = null; let dev2TestStaus = null;
     let cfxFullFailedTests = null; let cfxFullTestStatus = null;

     if( _developerResult1 !== null   ){
       devTestsToTriage =  getTestStaus( _developerResult1 );
       dev1FailedTests  = getFailedTests ( devTestsToTriage );
       console.log('Dev1 FailedTests Failed Details-->', dev1FailedTests);
    }
    if( _developerResult2 !== null   ){
      dev2TestStaus=  getTestStaus( _developerResult2 );
    }
    if( _cfxFullData !== null   ){
      cfxFullTestStatus=  getTestStaus( _cfxFullData );
    }
   
    let checkStatus = "PASSED";
    if( dev2TestStaus !=null && devTestsToTriage !=null ){
      updateTestStatus(  dev2TestStaus, dev1FailedTests , checkStatus );
    }
    checkStatus = "FAILED";
    updateTestStatus( cfxFullTestStatus, dev1FailedTests,checkStatus );
    setDevTestsToTriage(devTestsToTriage);

  }
  
  async function selectFile  (event)  {
      
    event.preventDefault();
    const reader = new FileReader();

    const id = event.target.id;
    //On File Read
    reader.onload = async (event) => { 
      if( id === 'cfxResult' ){
        _cfxFullData = JSON.parse(event.target.result)
        console.log(_cfxFullData);
      }
      if( id === 'devResult1' ){
        _developerResult1 = JSON.parse(event.target.result)
        console.log(_developerResult1);

      }else if( id === 'devResult2' ){
        _developerResult2 = JSON.parse(event.target.result)
        console.log(_developerResult2);
      }
     
    };
    
    //Read File
    reader.readAsText(event.target.files[0])

    
  }

  return (

    <main>
        <div className="inputSelect">
            <label  className="fileSelectorLabel" >Select CFx Hourly Reference JSON File:  </label>
            <input  className="fileSelectorInput" id="cfxResult"  type="file"  onChange={(e) => selectFile(e)}  />
        </div> 
        
        <div className="inputSelect">
                <label className="fileSelectorLabel">Select Developer Triage JSON File  : </label>
                <input className="fileSelectorInput" type="file" id="devResult1"  onChange={(e) => selectFile(e)} />
        </div>

        <div className="inputSelect">
              <label  className="fileSelectorLabel" >Select Developer Reference JSON File :</label>
              <input  className="fileSelectorInput" type="file" id="devResult2"  onChange={(e) => selectFile(e)} />
        </div>
        <button onClick={compareResults}> Compare Results </button>
        <div>
          <TableComponent tableRows={devTestsToTriage} />
        </div>
    </main>
  );
}

export default App;
