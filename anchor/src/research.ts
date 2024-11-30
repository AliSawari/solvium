export interface ResearchProgramT {
  title: string,
  summary: string,
  institutions: string,
  field: string,
  keywords: string
}


export  class ResearchProgram implements ResearchProgramT {
  title: string;
  summary: string;
  institutions: string;
  field: string;
  keywords: string;
  constructor(title,summary, institutions,field, keywords ) {
    this.title = title;
    this.summary = summary;
    this,institutions = institutions;
    this.field = field;
    this.keywords = keywords;
  }
}

