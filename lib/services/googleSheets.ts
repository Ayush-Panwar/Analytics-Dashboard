import { GOOGLE_SHEETS } from "./../constants/googleSheet";
import { google } from "googleapis";
import { AnalyticsData } from "../types/analytics";
import path from "path";

export class GoogleSheetsService {
  private static async getAuthClient() {
    const keyFilePath = path.join(process.cwd(), "secrets.json");
    return new google.auth.GoogleAuth({
      keyFile: keyFilePath,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
  }

  public static async fetchData(): Promise<AnalyticsData[]> {
    try {
      const auth = await this.getAuthClient();
      const sheets = google.sheets({ version: "v4", auth });

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: GOOGLE_SHEETS.SHEET_ID,
        range: GOOGLE_SHEETS.RANGE,
      });

      const rows = response.data.values || [];

      return this.transformData(rows.slice(1)); // Skip header row
    } catch (error) {
      console.error("Error fetching Google Sheets data:", error);
      throw new Error("Failed to fetch data from Google Sheets");
    }
  }

  private static transformData(rows: any[][]): AnalyticsData[] {
    const data: AnalyticsData[] = [];
    const parseDate = (dateStr: string): Date => {
      const [day, month, year] = dateStr.split("/");
      return new Date(`${month}/${day}/${year}`);
    };

    rows.forEach((row) => {
      const [date, age, gender, ...features] = row;

      features.forEach((timeSpent, index) => {
        const featureName = String.fromCharCode(65 + index); // Convert 0-5 to A-F
        data.push({
          id: Math.random().toString(36).substr(2, 9),
          date: parseDate(date),
          age,
          gender,
          feature: featureName,
          timeSpent: parseInt(timeSpent, 10),
        });
      });
    });

    return data;
  }
}
