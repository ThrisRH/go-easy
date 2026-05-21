export namespace dto {
	
	export class ImportPreview {
	    sheets: string[];
	    rows: string[][];
	    totalRows: number;
	    sheetName: string;
	
	    static createFrom(source: any = {}) {
	        return new ImportPreview(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.sheets = source["sheets"];
	        this.rows = source["rows"];
	        this.totalRows = source["totalRows"];
	        this.sheetName = source["sheetName"];
	    }
	}
	export class PreviewStudent {
	    id: string;
	    name: string;
	    mouth: string;
	    midterm: string;
	    final: string;
	    status: string;
	
	    static createFrom(source: any = {}) {
	        return new PreviewStudent(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.mouth = source["mouth"];
	        this.midterm = source["midterm"];
	        this.final = source["final"];
	        this.status = source["status"];
	    }
	}
	export class MergeResult {
	    successCount: number;
	    failCount: number;
	    students: PreviewStudent[];
	    mergedBase64: string;
	
	    static createFrom(source: any = {}) {
	        return new MergeResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.successCount = source["successCount"];
	        this.failCount = source["failCount"];
	        this.students = this.convertValues(source["students"], PreviewStudent);
	        this.mergedBase64 = source["mergedBase64"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

