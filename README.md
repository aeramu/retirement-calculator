# Retirement Calculator - FIRE & Die with Zero

A comprehensive retirement planning calculator that helps you plan your financial future using two popular strategies:

1. **FIRE (Financial Independence, Retire Early)** - Based on the 4% withdrawal rule
2. **Die with Zero** - Optimize spending to use up assets by end of life

## Features

- 📊 **Interactive Calculations** - Real-time updates as you adjust parameters
- 📈 **Visual Charts** - Line charts showing asset growth and bar charts for annual breakdown
- 🔄 **Two Calculation Methods** - Choose between FIRE and Die with Zero strategies
- 💰 **Comprehensive Inputs** - Account for expenses, inflation, investment returns, and partial retirement income
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Input Parameters

- **Annual Expenses**: Your current annual living expenses
- **Current Age**: Your current age
- **Inflation Rate**: Expected annual inflation rate (%)
- **Investment Return**: Expected annual investment return (%)
- **Current Assets**: Your current total assets/investments
- **Retirement Age**: Age when you want to retire
- **Partial Income After Retirement**: Any income you expect after retirement (part-time work, etc.)
- **Partial Income Until Age**: Until what age you expect to receive partial income

## Calculation Methods

### FIRE (4% Rule)

- Aims to preserve capital throughout retirement
- Uses the traditional 4% withdrawal rule
- Assumes 25% savings rate during accumulation phase
- Conservative approach that typically leaves inheritance

### Die with Zero

- Optimizes spending to use up assets by age 90
- Uses 20% savings rate during accumulation phase
- More aggressive spending in retirement
- Based on Bill Perkins' "Die with Zero" philosophy

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd retire-calculator
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React

## Usage

1. **Select Calculation Method**: Choose between FIRE and Die with Zero
2. **Enter Your Information**: Fill in all the input fields with your current financial situation
3. **Review Results**: Check the key results panel for important metrics
4. **Analyze Charts**:
   - Line chart shows your asset growth over time
   - Bar chart shows the breakdown of assets, expenses, and income by age

## Key Metrics Displayed

- **Assets at Retirement**: How much you'll have when you retire
- **Final Assets**: How much you'll have at the end (age 85 for FIRE, 90 for Die with Zero)
- **Visual Projections**: Charts showing your financial journey over time

## Assumptions

- Investment returns are consistent annually (no market volatility modeled)
- Inflation affects both expenses and partial income
- For FIRE: Preservation of capital is prioritized
- For Die with Zero: Assets are depleted by age 90
- Savings rates: 25% for FIRE, 20% for Die with Zero during accumulation

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).

## Disclaimer

This calculator is for educational and planning purposes only. It should not be considered as financial advice. Please consult with a qualified financial advisor for personalized financial planning.
