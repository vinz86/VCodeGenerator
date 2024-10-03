export class DateHelper {

    static getCurrentDate(): Date {
        return new Date();
    }

    static parse(dateString: string): Date | null {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date;
    }

    static formatDate(date: Date | string, format: string): string | null {
        let validDate: Date | null;

        if (typeof date === 'string') {
            validDate = this.parseDate(date);
        } else {
            validDate = isNaN(date.getTime()) ? null : date;
        }

        if (!validDate) {
            console.error("Data malformata o non valida");
            return null;
        }

        const year = validDate.getFullYear();
        const month = this.padWithZero(validDate.getMonth() + 1);
        const day = this.padWithZero(validDate.getDate());
        const hours = this.padWithZero(validDate.getHours());
        const minutes = this.padWithZero(validDate.getMinutes());
        const seconds = this.padWithZero(validDate.getSeconds());

        return format
            .replace('YYYY', year.toString())
            .replace('YY', year.toString().slice(-2))
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('SS', seconds);
    }

    static daysBetween(date1: Date | string, date2: Date | string): number | null {
        const validDate1 = typeof date1 === 'string' ? this.parseDate(date1) : date1;
        const validDate2 = typeof date2 === 'string' ? this.parseDate(date2) : date2;

        if (!validDate1 || !validDate2) {
            console.error("Una o entrambe le date non sono valide");
            return null;
        }

        const msPerDay = 1000 * 60 * 60 * 24;
        const diffInTime = validDate2.getTime() - validDate1.getTime();
        return Math.round(diffInTime / msPerDay);
    }

    static toISOString(date: Date | string): string | null {
        const validDate = typeof date === 'string' ? this.parseDate(date) : date;

        if (!validDate) {
            console.error("Data malformata o non valida");
            return null;
        }

        return validDate.toISOString();
    }

    private static padWithZero(value: number): string {
        return value < 10 ? '0' + value : value.toString();
    }
}
