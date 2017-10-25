function writeSyllabusLessonIds(syllabusLessonSheet) {
    writeIds(syllabusLessonSheet, SYLLABUS_COLUMNS[ID], generateSyllabusLessonIdFromRow);
}

function writeSyllabusLessonsToFirestoreForLanguage(languageCode, syllabusLessonData, boardLessonTopicPairData) {
    forRowsWithLanguageName(syllabusLessonData, SYLLABUS_COLUMNS, languageCode, function(row) {
        var idAndObject = getIdAndObjectFromRow(row, SYLLABUS_COLUMNS, languageCode);
        var lessonId = idAndObject[ID];
        var lessonObject = idAndObject[OBJECT];

        lessonObject[TOPIC_COUNT] = countAssociatedTopics(lessonId, boardLessonTopicPairData);

        var path = "localized/" + languageCode + "/syllabus_lessons/" + lessonId;
        FirestoreApp.updateDocument(path, lessonObject, email, key, projectId);
    });
}

function countAssociatedTopics(lessonId, boardLessonTopicPairData) {
    var lessonPairs = filterExactByText(boardLessonTopicPairData, BOARDLESSON_TOPIC_PAIR_COLUMNS[LESSON], lessonId);
    var uniqueTopicPairs = ArrayLib.unique(lessonPairs, BOARDLESSON_TOPIC_PAIR_COLUMNS[TOPIC]);
    return uniqueTopicPairs.length;
}

function generateSyllabusLessonIdFromRow(row) {
    var board = row[SYLLABUS_COLUMNS[BOARD]];
    var level = row[SYLLABUS_COLUMNS[LEVEL]];
    var subject = row[SYLLABUS_COLUMNS[SUBJECT]];
    var lessonNameEnglish = row[SYLLABUS_COLUMNS[NAME][ENGLISH_LOCALE]];

    return (board + ID_DIV + level + ID_DIV + subject + ID_DIV + lessonNameEnglish).toLowerCase();
}