export default function capabilities(browserName: string) {
  return {
    name: 'TODO app',
    recordVideo: 'true',
    // eslint-disable-next-line @typescript-eslint/camelcase
    record_network: 'true',
    browserName,
    platform: process.env['CBT_PLATFORM'] || 'Windows 10',
    screenResolution: process.env['CBT_RESOLUTION'] || '1366x768',
    version: process.env['CBT_VERSION'] || 'Latest',
  }
}
