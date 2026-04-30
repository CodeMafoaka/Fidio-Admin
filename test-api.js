// Test API pour récupérer un citoyen par CIN
const API_BASE_URL = "https://fidio-api-dev.onrender.com"; // URL depuis le .env

async function testGetCitizenByGid() {
  console.log("🧪 Test: Récupération citoyen par CIN");

  const testGid = "123456";
  const token = "test-token"; // Token de test

  // Test sans token d'abord
  try {
    console.log("📡 Test sans authentification...");
    const response = await fetch(`${API_BASE_URL}/citizens?gid=${testGid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("📡 Status:", response.status);
    console.log("📡 Headers:", response.headers);

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Network error" }));
      console.error("❌ Erreur API:", {
        status: response.status,
        errorData,
        gid: testGid,
      });
      return;
    }

    const data = await response.json();
    console.log("✅ Succès API:", {
      found: data.length > 0,
      count: data.length,
      data: data,
    });

    if (data.length > 0) {
      console.log("👤 Citoyen trouvé:", data[0]);
    } else {
      console.log("🔍 Aucun citoyen trouvé pour ce CIN");
    }
  } catch (error) {
    console.error("💥 Erreur réseau:", error);
  }
}

// Test de création d'élection
async function testCreateElection() {
  console.log("\n🧪 Test: Création élection");

  const electionData = [
    {
      title: "Élection Test API",
      startAt: new Date().toISOString(),
      endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // +7 jours
      candidates: [
        {
          gid: "123456",
          description: "Candidat Test 1",
        },
        {
          gid: "789012",
          description: "Candidat Test 2",
        },
      ],
    },
  ];

  const token = "test-token";

  try {
    const response = await fetch(`${API_BASE_URL}/elections`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(electionData),
    });

    console.log("📡 Status:", response.status);

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Network error" }));
      console.error("❌ Erreur création élection:", {
        status: response.status,
        errorData,
      });
      return;
    }

    const data = await response.json();
    console.log("✅ Élection créée:", data);
  } catch (error) {
    console.error("💥 Erreur création élection:", error);
  }
}

// Exécuter les tests
async function runTests() {
  console.log("🚀 Début des tests API");
  console.log("🌐 URL API:", API_BASE_URL);

  await testGetCitizenByGid();
  await testCreateElection();

  console.log("\n✅ Tests terminés");
}

runTests();
