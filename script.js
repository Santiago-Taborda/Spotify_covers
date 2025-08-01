function convertUrl() {
  const url = document.getElementById("coverUrl").value.trim();
  const info = document.getElementById("info");
  let newUrl = "";
  info.textContent = "";

  if (url.includes("ab67616d0000b273")) {
    newUrl = url.replace("ab67616d0000b273", "ab67616d000082c1");
    info.textContent = "✅ Imagen convertida a máxima calidad disponible (album/artista).";
  } else if ((url.includes("image-cdn-") && url.includes(".spotifycdn.com")) || url.includes("ab67706c")) {
    newUrl = url;
    info.textContent =
      "ℹ️ Esta imagen ya está en la máxima calidad disponible.";
  } else {
    info.textContent = "⚠️ No se reconoce el formato de la URL.";
    return;
  }

  mostrarImagen(newUrl, "spotify_cover");
}

let format = false

function switchFormat() {
  format = !format;
  const switchFormatBtn = document.getElementById("switchFormatBtn");
  switchFormatBtn.textContent = format ? "Cambiar a formato: Name" : "Cambiar a formato: DATE • Name";
}

async function fetchImageFromSpotifyLink() {
  const link = document.getElementById("spotifyLink").value.trim();
  const info = document.getElementById("info");
  info.textContent = "Buscando portada...";
  if (link === "" || !link.includes("spotify.com")) {
    info.textContent = "❌ Por favor, ingresa un enlace de spotify.com.";
    return;
  }
  
  try {
    const res = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(link)}`);
    const data = await res.json();
    
    if (data && data.thumbnail_url) {
      const original = data.thumbnail_url;
      let hdUrl = original;
      if (original.includes("ab67616d00001e02"))
        hdUrl = original.replace("ab67616d00001e02", "ab67616d000082c1");
      if (original.includes("ab67616d0000b273"))
        hdUrl = original.replace("ab67616d0000b273", "ab67616d000082c1");

     let fileName = "spotify_cover";
      if (data.title && format) fileName = "DATE • " + data.title
      if (data.title && !format) fileName = data.title

      info.textContent =
        "✅ Portada obtenida desde el enlace de Spotify en alta calidad (si aplica).";
      mostrarImagen(hdUrl, fileName);
    } else {
      info.textContent = "❌ No se pudo obtener la imagen desde el enlace proporcionado.";
    }
  } catch (err) {
    info.textContent = "❌ Error al procesar el enlace.";
  }
}

function mostrarImagen(src, filename = "spotify_cover") {
  const img = document.getElementById("coverImg");
  const downloadBtn = document.getElementById("downloadBtn");

  img.src = src;
  img.style.display = "block";

  // Descargar imagen como blob para forzar descarga con nombre personalizado
  fetch(src)
    .then(res => res.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      downloadBtn.href = url;
      downloadBtn.download = filename + ".jpg";
      downloadBtn.style.display = "inline-block";
    })
    .catch(() => {
      downloadBtn.style.display = "none";
      document.getElementById("info").textContent += " ❌ No se pudo preparar la descarga.";
    });
}
