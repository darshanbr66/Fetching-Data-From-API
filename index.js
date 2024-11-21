// https://api.example.com?text=search%20term&token=12345
// https://api.projectpq.ai/suggest/cpcs?text=search%20term&token=2fb4fadec262f3a8a21f6e5e1d3e3481
// const apiUrl = "https://api.projectpq.ai/suggest/cpcs";
// const token = "2fb4fadec262f3a8a21f6e5e1d3e3481";
const searchInput = document.getElementById("searchData");
const submitBtn = document.getElementById("submitBtn");
const refreshBtn = document.getElementById("refreshBtn");
const fetchDataDiv = document.getElementById("fetchData");

const apiUrl = "https://api.projectpq.ai/suggest/cpcs";
const token = "2fb4fadec262f3a8a21f6e5e1d3e3481";

// Function to fetch data from the API
async function fetchData(query = "") {
  try  {
    const response = await fetch(
      `${apiUrl}?text=${encodeURIComponent(query)}&token=${token}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    displayData(data);
    console.log('Array data',data);
    
  } catch (e) {
    console.error("Error fetching data:", e);
    fetchDataDiv.innerHTML = `<p>Error: ${e.message}</p>`;
  }
}

// Function to display data in a table format
function displayData(data) {
  if (data && data.length > 0) {
    let htmlContent = `
      <table border="1" style="border-collapse: collapse; width: 100%; text-align: center;">
        <thead>
          <tr>
            <th>Sl.no</th>
            <th>CPC</th>
            <th>Definition</th>
            <th>Confidence</th>
          </tr>
        </thead>
        <tbody>
    `;

    data.forEach((item, index) => {
      htmlContent += `
        <tr>
          <td>${index + 1}</td>
          <td>${item.cpc}</td>
          <td style="text-align: left;">${formatDefinition(item.definition)}</td>
          <td>${item.confidence}</td>
        </tr>
      `;
    });

    htmlContent += `
        </tbody>
      </table>
    `;
    fetchDataDiv.innerHTML = htmlContent;
  } else {
    fetchDataDiv.innerHTML = "<p>No results found.</p>";
  }
}

// Updated function to format the definition field
function formatDefinition(definition) {
  if (Array.isArray(definition)) {
    let formattedHTML = "";
    definition.forEach((item) => {
      if (Array.isArray(item) && item.length === 2) {
        const boldWord = `<strong>${item[0]}</strong>`; // Bold the first word
        const restOfLine = item[1]; // Rest of the description
        formattedHTML += `<p>${boldWord}: ${restOfLine}</p>`;
      } else {
        // Handle any unexpected format gracefully
        formattedHTML += `<p>${JSON.stringify(item)}</p>`;
      }
    });
    return formattedHTML;
  } else {
    return `<p>${JSON.stringify(definition)}</p>`;
  }
}

// Event listener for the Submit button
submitBtn.addEventListener("click", () => {
  const searchQuery = searchInput.value.trim();
  fetchData(searchQuery);
});

// Event listener for the Refresh button
refreshBtn.addEventListener("click", () => {
  fetchDataDiv.innerHTML = "";
  searchInput.value = "";
});
