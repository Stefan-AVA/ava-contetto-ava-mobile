const { AndroidConfig, withAndroidManifest } = require("@expo/config-plugins")

const { addMetaDataItemToMainApplication } = AndroidConfig.Manifest

function addAttributesToMainActivity(androidManifest, attributes) {
  const { manifest } = androidManifest

  if (!Array.isArray(manifest["application"])) {
    console.warn(
      "withAndroidMainActivityAttributes: No application array in manifest?"
    )
    return androidManifest
  }

  const application = manifest["application"].find(
    (item) => item.$["android:name"] === ".MainApplication"
  )

  if (!application) {
    console.warn("withAndroidMainActivityAttributes: No .MainApplication?")
    return androidManifest
  }

  Object.entries(attributes).forEach(([key, value]) =>
    addMetaDataItemToMainApplication(application, key, value)
  )

  return androidManifest
}

module.exports = function withAndroidMainActivityAttributes(
  config,
  attributes
) {
  return withAndroidManifest(config, (config) => {
    config.modResults = addAttributesToMainActivity(
      config.modResults,
      attributes
    )

    return config
  })
}
