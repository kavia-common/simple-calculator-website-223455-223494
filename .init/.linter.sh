#!/bin/bash
cd /home/kavia/workspace/code-generation/simple-calculator-website-223455-223494/CalculatorWebApplication
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

