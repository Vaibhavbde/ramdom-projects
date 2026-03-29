import { API_KEY } from "./config";

export interface LogoResponse {
  data?: Logo[];
  error?: any;
}

interface Logo {
  id: string;
  search_key: string;
  files: File;
  created_at: string;
  updated_at: string;
}

interface File {
  mark_vector_dark?: string;
  mark_vector_light?: string;
}

export const fetchLogo = async (logo: string): Promise<LogoResponse> => {
  const queryParams = new URLSearchParams({
    token: API_KEY,
    search_keys: `${logo}`,
    search_keys_type: `symbol`,
    fields: "mark_vector_light",
  }).toString();

  const url = `https://api.benzinga.com/api/v2/logos/search?${queryParams}`;

  try {
    const resp = await fetch(url, {
      headers: {
        accept: "application/json",
      },
    });
    const jsonResp = await resp.json();

    if (!resp.ok) {
      return { error: "Something went wrong" };
    }
    return { data: jsonResp.data };
  } catch (error) {
    return { error };
  }
};
