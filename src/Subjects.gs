function writeSubjectsToFirebase() {
  var base = FirebaseApp.getDatabaseByUrl(FIREBASE_URL, SECRET);
  
  var HappyTeacherSpreadsheet = SpreadsheetApp.openById(SHEET_ID);
  var subjectsSheet = HappyTeacherSpreadsheet.getSheetByName("Subjects");
  var subjectsData = subjectsSheet.getDataRange().getValues();
  
  var subjectsObject = {}
  for (var i = 1; i < subjectsData.length; i++) {
    var row = subjectsData[i];
    
    var id = row[SUBJECTS_COLUMN_ID];
    var isActive = row[SUBJECTS_COLUMN_IS_ACTIVE];
    var names = getNamesObjectFromSubjectRow(row);
    
    var subjectObject = {}
    subjectObject[NAMES] = names;
    subjectObject[IS_ACTIVE] = isActive;
    
    subjectsObject[id] = subjectObject;
  }
  base.setData("subjects", subjectsObject);
}

function getNamesObjectFromSubjectRow(row) {
  var names = {};
      
  var engName = row[SUBJECTS_COLUMN_ENGLISH_NAME];
  var marName = row[SUBJECTS_COLUMN_MARATHI_NAME];
  var hinName = row[SUBJECTS_COLUMN_HINDI_NAME];
        
  if (engName) {
    names[LANGUAGE_CODE_ENGLISH] = engName;
  } 
  if (marName) {
    names[LANGUAGE_CODE_MARATHI] = marName;
  } 
  if (hinName) {
    names[LANGUAGE_CODE_HINDI] = hinName;
  }
  
  return names;
}