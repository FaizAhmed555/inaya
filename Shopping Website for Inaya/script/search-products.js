import { SearchProducts , getParameter} from "/script/script.js";

SearchProducts(getParameter("search"))
const searchResults = document.querySelector("#search-results")
searchResults.innerHTML = getParameter("search")