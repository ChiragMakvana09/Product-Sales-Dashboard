import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChartConfiguration, ChartType } from 'chart.js';
import bankingData from '../assets/banking.json';

interface FinancialProduct {
  name: string;
  value: number;
  growth: number;
  interestRate: number;
  monthlyTrend: number[];
}

interface BranchPerformance {
  name: string;
  transactions: number;
  revenue: number;
  customers: number;
  growth: number;
}

interface BankingData {
  monthlyTransactions: { [key: string]: number };
  yearlyTransactions: { [key: string]: number };
  financialProducts: FinancialProduct[];
  serviceCategories: { [key: string]: number };
  branchPerformance: BranchPerformance[];
  customerSegments: { [key: string]: number };
  transactionTypes: { [key: string]: number };
  monthlyGrowth: number[];
  interestRates: number[];
  activeUsers: number[];
  revenueData: number[];
  dashboardInfo: {
    title: string;
    subtitle: string;
    currency: string;
    currencySymbol: string;
  };
}

@Component({
  selector: 'app-root',
  imports: [NgChartsModule, CommonModule],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  chartType: ChartType = 'bar';
  chartLabels: string[] = [];
  chartData: number[] = [];
  chartTitle: string = "Banking Dashboard";
  currentView: string = 'monthly';
  isBrowser: boolean;
  bankingData: BankingData | null = null;
  loading: boolean = true;

  // Available chart types for switching
  availableChartTypes: { type: ChartType; icon: string; name: string; description: string }[] = [
    { type: 'bar', icon: '📊', name: 'Bar', description: 'Bar Chart' },
    { type: 'line', icon: '📈', name: 'Line', description: 'Line Chart' },
    { type: 'pie', icon: '🥧', name: 'Pie', description: 'Pie Chart' },
    { type: 'doughnut', icon: '🍩', name: 'Doughnut', description: 'Doughnut Chart' },
    { type: 'radar', icon: '🕷️', name: 'Radar', description: 'Radar Chart' },
    { type: 'polarArea', icon: '🎯', name: 'Polar', description: 'Polar Area Chart' },
  ];

  public chartConfig: ChartConfiguration['data'] = {
    labels: this.chartLabels,
    datasets: [{
      label: this.chartTitle,
      data: this.chartData,
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };

  public chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => `₹${context.parsed.y.toLocaleString()}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => `₹${value.toLocaleString()}`
        }
      }
    }
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.loadBankingData();
  }

  // loadBankingData() {
  //   this.http.get<any>('assets/banking.json').subscribe({
  //     next: (data) => {
  //       this.bankingData = data;
  //       this.loading = false;
  //       if (this.isBrowser) this.showMonthly();
  //     },
  //     error: (error) => {
  //       // fallback data
  //       this.bankingData = this.getDefaultBankingData();
  //       this.loading = false;
  //       if (this.isBrowser) this.showMonthly();
  //     }
  //   });
  // }
  loadBankingData() {
    this.bankingData = bankingData;
    this.loading = false;
    if (this.isBrowser) this.showMonthly();
  }
  
  

  getDefaultBankingData(): BankingData {
    return {
      monthlyTransactions: {
        Jan: 12500000, Feb: 13800000, Mar: 15600000, Apr: 14200000,
        May: 16800000, Jun: 17500000, Jul: 18900000, Aug: 19200000,
        Sep: 20100000, Oct: 21800000, Nov: 22500000, Dec: 24500000
      },
      yearlyTransactions: {
        "2020": 180000000, "2021": 210000000, "2022": 245000000, "2023": 280000000
      },
      financialProducts: [
        { name: "Savings", value: 45000000, growth: 12.5, interestRate: 4.5, monthlyTrend: [1200000, 1350000, 1480000, 1320000, 1560000, 1620000, 1750000, 1810000, 1920000, 2080000, 2150000, 2350000] },
        { name: "Current", value: 38000000, growth: 8.2, interestRate: 3.8, monthlyTrend: [950000, 1020000, 1150000, 1080000, 1220000, 1280000, 1350000, 1420000, 1480000, 1580000, 1650000, 1750000] },
        { name: "Fixed Deposit", value: 52000000, growth: 15.8, interestRate: 6.2, monthlyTrend: [850000, 920000, 1080000, 980000, 1120000, 1180000, 1250000, 1320000, 1410000, 1520000, 1580000, 1680000] },
        { name: "Personal Loan", value: 28000000, growth: 6.4, interestRate: 12.5, monthlyTrend: [680000, 720000, 810000, 750000, 860000, 920000, 980000, 1040000, 1120000, 1180000, 1250000, 1320000] },
        { name: "Home Loan", value: 65000000, growth: 18.2, interestRate: 8.9, monthlyTrend: [420000, 460000, 520000, 480000, 560000, 610000, 650000, 680000, 720000, 780000, 820000, 880000] },
        { name: "Credit Card", value: 32000000, growth: 9.7, interestRate: 18.5, monthlyTrend: [350000, 380000, 420000, 390000, 450000, 480000, 520000, 550000, 590000, 630000, 670000, 710000] },
        { name: "Investment", value: 41000000, growth: 11.3, interestRate: 9.2, monthlyTrend: [180000, 200000, 220000, 210000, 240000, 260000, 280000, 300000, 320000, 340000, 360000, 380000] },
        { name: "Insurance", value: 25000000, growth: 7.1, interestRate: 5.8, monthlyTrend: [220000, 240000, 270000, 250000, 290000, 310000, 330000, 350000, 380000, 410000, 440000, 470000] }
      ],
      serviceCategories: {
        "Deposits": 45, "Loans": 30, "Cards": 15, "Investments": 10
      },
      branchPerformance: [
        { name: "Mumbai Central", transactions: 8500000, revenue: 12500000, customers: 25000, growth: 12.5 },
        { name: "Delhi Main", transactions: 7200000, revenue: 10800000, customers: 22000, growth: 8.7 },
        { name: "Bangalore Tech", transactions: 6800000, revenue: 9800000, customers: 18000, growth: 15.2 },
        { name: "Chennai South", transactions: 5900000, revenue: 8700000, customers: 15000, growth: 6.8 },
        { name: "Kolkata East", transactions: 5200000, revenue: 7600000, customers: 12000, growth: 9.3 }
      ],
      customerSegments: {
        "Retail": 60, "Corporate": 25, "SME": 10, "High Net Worth": 5
      },
      transactionTypes: {
        "Online Banking": 45, "ATM": 25, "Branch": 20, "Mobile App": 10
      },
      monthlyGrowth: [8.2, 9.1, 7.8, 6.9, 8.7, 9.5, 10.2, 9.8, 11.1, 12.3, 13.5, 14.2],
      interestRates: [4.5, 3.8, 6.2, 12.5, 8.9, 18.5, 9.2, 5.8],
      activeUsers: [125, 138, 156, 142, 168, 175, 189, 192, 201, 218, 225, 245],
      revenueData: [54000000, 45600000, 62400000, 33600000, 78000000, 59200000, 73800000, 38400000],
      dashboardInfo: {
        title: "Banking Dashboard",
        subtitle: "Financial Analytics",
        currency: "INR",
        currencySymbol: "₹"
      }
    };
  }

  showMonthly() {
    if (!this.bankingData) return;
    this.currentView = 'monthly';
    this.chartType = 'bar';
    this.chartTitle = "Monthly Transactions";
    this.chartLabels = Object.keys(this.bankingData.monthlyTransactions);
    this.chartData = Object.values(this.bankingData.monthlyTransactions);
    this.updateChart();
    this.updateChartOptions();
  }

  showYearly() {
    if (!this.bankingData) return;
    this.currentView = 'yearly';
    this.chartType = 'line';
    this.chartTitle = "Yearly Transactions";
    this.chartLabels = Object.keys(this.bankingData.yearlyTransactions);
    this.chartData = Object.values(this.bankingData.yearlyTransactions);
    this.updateChart();
    this.updateChartOptions();
  }

  showServiceCategories() {
    if (!this.bankingData) return;
    this.currentView = 'categories';
    this.chartType = 'doughnut';
    this.chartTitle = "Service Categories";
    this.chartLabels = Object.keys(this.bankingData.serviceCategories);
    this.chartData = Object.values(this.bankingData.serviceCategories);
    this.updateChart();
    this.updateChartOptions();
  }

  showProductPerformance() {
    if (!this.bankingData) return;
    this.currentView = 'products';
    this.chartType = 'bar';
    this.chartTitle = "Product Performance";
    this.chartLabels = this.bankingData.financialProducts.map(p => p.name);
    this.chartData = this.bankingData.financialProducts.map(p => p.value);
    this.updateChart();
    this.updateChartOptions();
  }

  showProductMonthlyTrend(productIndex: number = 0) {
    if (!this.bankingData) return;
    this.currentView = 'product-trend';
    this.chartType = 'line';
    const product = this.bankingData.financialProducts[productIndex];
    this.chartTitle = `${product.name} Monthly Trend`;
    this.chartLabels = Object.keys(this.bankingData.monthlyTransactions);
    this.chartData = product.monthlyTrend;
    this.updateChart();
    this.updateChartOptions();
  }

  showRevenueAnalysis() {
    if (!this.bankingData) return;
    this.currentView = 'revenue';
    this.chartType = 'bar';
    this.chartTitle = "Revenue Analysis";
    this.chartLabels = this.bankingData.financialProducts.map(p => p.name);
    this.chartData = this.bankingData.revenueData;
    this.updateChart();
    this.updateChartOptions();
  }

  showBranchPerformance() {
    if (!this.bankingData) return;
    this.currentView = 'branches';
    this.chartType = 'bar';
    this.chartTitle = "Branch Performance";
    this.chartLabels = this.bankingData.branchPerformance.map(b => b.name);
    this.chartData = this.bankingData.branchPerformance.map(b => b.transactions);
    this.updateChart();
    this.updateChartOptions();
  }

  showCustomerSegments() {
    if (!this.bankingData) return;
    this.currentView = 'customers';
    this.chartType = 'pie';
    this.chartTitle = "Customer Segments";
    this.chartLabels = Object.keys(this.bankingData.customerSegments);
    this.chartData = Object.values(this.bankingData.customerSegments);
    this.updateChart();
    this.updateChartOptions();
  }

  showTransactionTypes() {
    if (!this.bankingData) return;
    this.currentView = 'transaction-types';
    this.chartType = 'doughnut';
    this.chartTitle = "Transaction Types";
    this.chartLabels = Object.keys(this.bankingData.transactionTypes);
    this.chartData = Object.values(this.bankingData.transactionTypes);
    this.updateChart();
    this.updateChartOptions();
  }

  showMonthlyGrowth() {
    if (!this.bankingData) return;
    this.currentView = 'growth';
    this.chartType = 'line';
    this.chartTitle = "Monthly Growth Rate (%)";
    this.chartLabels = Object.keys(this.bankingData.monthlyTransactions);
    this.chartData = this.bankingData.monthlyGrowth;
    this.updateChart();
    this.updateChartOptions();
  }

  showInterestRates() {
    if (!this.bankingData) return;
    this.currentView = 'interest-rates';
    this.chartType = 'bar';
    this.chartTitle = "Interest Rates by Product";
    this.chartLabels = this.bankingData.financialProducts.map(p => p.name);
    this.chartData = this.bankingData.interestRates;
    this.updateChart();
    this.updateChartOptions();
  }

  showActiveUsers() {
    if (!this.bankingData) return;
    this.currentView = 'active-users';
    this.chartType = 'line';
    this.chartTitle = "Active Users (Thousands)";
    this.chartLabels = Object.keys(this.bankingData.monthlyTransactions);
    this.chartData = this.bankingData.activeUsers;
    this.updateChart();
    this.updateChartOptions();
  }

  updateChart() {
    this.chartConfig = {
      labels: this.chartLabels,
      datasets: [{
        label: this.chartTitle,
        data: this.chartData,
        backgroundColor: this.getChartColors(),
        borderColor: this.getBorderColors(),
        borderWidth: 1
      }]
    };
  }

  // Switch chart type while keeping the same data
  switchChartType(newType: ChartType) {
    this.chartType = newType;
    this.updateChartOptions();
  }

  // Update chart options based on chart type
  updateChartOptions() {
    const baseOptions: any = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { 
          display: this.chartType === 'pie' || this.chartType === 'doughnut' || this.chartType === 'polarArea',
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              if (this.chartType === 'pie' || this.chartType === 'doughnut' || this.chartType === 'polarArea') {
                const total = this.chartData.reduce((sum, val) => sum + val, 0);
                const percentage = ((context.parsed / total) * 100).toFixed(1);
                return `${context.label}: ₹${context.parsed.toLocaleString()} (${percentage}%)`;
              }
              return `₹${context.parsed.y?.toLocaleString() || context.parsed.toLocaleString()}`;
            }
          }
        }
      }
    };

    // Add scales for charts that need them
    if (this.chartType === 'bar' || this.chartType === 'line') {
      this.chartOptions = {
        ...baseOptions,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value: any) => `₹${value.toLocaleString()}`
            }
          }
        }
      };
    } else {
      this.chartOptions = baseOptions;
    }
  }

  getChartColors(): string[] {
    const colors = [
      'rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)',
      'rgba(255, 205, 86, 0.6)', 'rgba(75, 192, 192, 0.6)',
      'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)',
      'rgba(199, 199, 199, 0.6)', 'rgba(83, 102, 255, 0.6)'
    ];
    return this.chartData.map((_, i) => colors[i % colors.length]);
  }

  getBorderColors(): string[] {
    const colors = [
      'rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)',
      'rgba(255, 205, 86, 1)', 'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)',
      'rgba(199, 199, 199, 1)', 'rgba(83, 102, 255, 1)'
    ];
    return this.chartData.map((_, i) => colors[i % colors.length]);
  }

  getTotalTransactions(): number {
    return this.chartData.reduce((sum, val) => sum + val, 0);
  }

  getAverageTransactions(): number {
    return this.chartData.length > 0 ? this.getTotalTransactions() / this.chartData.length : 0;
  }

  getCategoryCount(): number {
    return this.bankingData?.serviceCategories ? Object.keys(this.bankingData.serviceCategories).length : 0;
  }

  getProductCount(): number {
    return this.bankingData?.financialProducts?.length || 0;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
}