# Test image for the accreditation studio. Pinned so results are reproducible.
#
# Contents: Chromium/Firefox/WebKit from the Playwright base image, Node for jsdom and Playwright,
# Python 3 with PyYAML. The repository is NOT baked in; tests/run.sh mounts it read-only and the
# suite works on a private copy, so a test run can never modify your checkout.
FROM mcr.microsoft.com/playwright:v1.64.1-noble

ENV DEBIAN_FRONTEND=noninteractive \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright \
    NPM_CONFIG_UPDATE_NOTIFIER=false

RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 python3-yaml unzip git ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/qa
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund \
 && node -e "require('jsdom'); require('playwright'); console.log('node', process.version)" \
 && python3 -c "import yaml, sqlite3; print('python ok')"

COPY run_suite.sh /opt/qa/run_suite.sh
RUN chmod 0755 /opt/qa/run_suite.sh && mkdir -p /work /results && chown pwuser:pwuser /work /results

# The Playwright image ships a non-root user; run the suite as that user.
USER pwuser
WORKDIR /work
ENTRYPOINT ["/opt/qa/run_suite.sh"]
