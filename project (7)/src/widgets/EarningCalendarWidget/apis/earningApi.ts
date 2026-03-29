import { API_KEY } from "./config";

export interface EarningResponse {
  earnings?: EarningData[];
  error?: any;
}

export interface EarningData {
  currency: string;
  date: string;
  date_confirmed: number;
  eps: string;
  eps_est: string;
  eps_prior: string;
  eps_surprise: string;
  eps_surprise_percent: string;
  eps_type: string;
  exchange: string;
  id: string;
  importance: number;
  name: string;
  notes: string;
  period: string;
  period_year: number;
  revenue: string;
  revenue_est: string;
  revenue_prior: string;
  revenue_surprise: string;
  revenue_surprise_percent: string;
  revenue_type: string;
  ticker: string;
  time: string;
  updated: number;
  imageUrl?: string;
}

export interface Params {
  from_date: string;
  to_date: string;
}

export const fetchEarnings = async (
  params: Params
): Promise<EarningResponse> => {
  const queryParams = new URLSearchParams({
    token: API_KEY,
    "parameters[date_from]": params.from_date,
    "parameters[date_to]": params.to_date,
  }).toString();

  const url = `https://api.benzinga.com/api/v2.1/calendar/earnings?${queryParams}`;

  try {
    const resp = await fetch(url, {
      headers: {
        accept: "application/json",
      },
    });
    const jsonResp = await resp.json();
    return jsonResp;
  } catch (error) {
    return { error };
  }
};
