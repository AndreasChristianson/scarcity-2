export default () => window.location.host.startsWith('scarcity') ?
    `wss://wss.scarcity.pessimistic-it.com` :
    'wss://wss.dev.scarcity.pessimistic-it.com';