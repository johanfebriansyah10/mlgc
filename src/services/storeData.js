const { Firestore } = require('@google-cloud/firestore');

async function storeData(id, data) {
  const db = new Firestore({
    projectId: 'submissionmlgc-johan10',
    databaseId: '(default)'
  });
  
  const predictCollection = db.collection('prediction');
  return predictCollection.doc(id).set(data);
}


function docData(doc){
  return {
    id: doc.id,
    history: {
      result: doc.data().result,
      createdAt: doc.data().createdAt,
      suggestion: doc.data().suggestion,
      id: doc.id
    }
  };
};

async function getHistory(id = null) {
  const predictCollection = db.collection('prediction');
  if(id){
    const doc = await predictCollection.doc(id).get();
    if(!doc.exists) return null;
    return docData(doc);
  } else{
    const snapshot = await predictCollection.get();
    const allData = [];
    snapshot.forEach(doc => allData.push(docData(doc)));
    return allData;
  }
}

module.exports =  { storeData, getHistory }