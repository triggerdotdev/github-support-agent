import { getRepoFileContent } from "./github";

type MintlifyPage = string; // "group/page"

type MintlifyGroup = {
  group: string;
  pages: (MintlifyPage | MintlifyGroup)[];
};

type MintlifyDropdown = {
  dropdown: string;
  groups: MintlifyGroup[];
};

type MintlifyNavigation = 
  | (MintlifyGroup | MintlifyPage)[]
  | { dropdowns: MintlifyDropdown[] };

type MintlifyConfig = {
  navigation: MintlifyNavigation;
  // other fields ignored for now
};

export async function getMintlifyPages(owner: string, repo: string, configPath: string): Promise<string[]> {
  try {
    const content = await getRepoFileContent(owner, repo, configPath);
    if (!content) {
      console.warn(`Mintlify config not found at ${configPath}`);
      return [];
    }

    const config = JSON.parse(content) as MintlifyConfig;
    return extractPages(config.navigation);
  } catch (error) {
    console.error("Error parsing Mintlify config:", error);
    return [];
  }
}

function extractPages(nav: MintlifyNavigation | MintlifyDropdown[] | MintlifyGroup[]): string[] {
  let pages: string[] = [];
  
  // Handle { dropdowns: [...] } object style
  if (!Array.isArray(nav) && typeof nav === "object" && "dropdowns" in nav) {
    return extractPages(nav.dropdowns);
  }

  // Handle array style (dropdowns, groups, or pages)
  if (Array.isArray(nav)) {
    for (const item of nav) {
      if (typeof item === "string") {
        // It's a page path
        pages.push(item);
      } else if (typeof item === "object") {
        if ("dropdown" in item && item.groups) {
            // It's a dropdown
            pages = pages.concat(extractPages(item.groups));
        } else if ("group" in item && item.pages) {
            // It's a group
            pages = pages.concat(extractPages(item.pages));
        }
      }
    }
  }
  
  return pages;
}
