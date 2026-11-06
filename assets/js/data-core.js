/* Content registry. Each chapter file calls PM.chapter({...}). */
(function (global) {
  const chapters = [];

  const PM = {
    chapters,
    chapter(obj) {
      chapters.push(obj);
    },
    /* Chapter lookup by id (1-13) */
    get(id) {
      return chapters.find((c) => c.id === Number(id)) || null;
    },
    sorted() {
      return chapters.slice().sort((a, b) => a.id - b.id);
    },
    /* Flat list of every expression, tagged with its chapter */
    allExpressions() {
      const out = [];
      chapters.forEach((c) => {
        (c.expressions || []).forEach((e, i) => {
          out.push({ ...e, chapterId: c.id, chapterTitle: c.title, key: c.id + ":" + i });
        });
      });
      return out;
    },
    totalExercises() {
      return chapters.reduce((n, c) => n + (c.exercises || []).length, 0);
    }
  };

  global.PM = PM;
})(typeof window !== "undefined" ? window : globalThis);
