// src/api/salesApi.js

const API_BASE =
  "http://192.250.228.179:9088/api/v1";

export async function getProductStatus(
  params = {}
) {

  try {

    const query = new URLSearchParams();

    // ================= FILTER MAP =================

    if (params.company?.length) {
      query.append(
        "companyCode",
        params.company.join(",")
      );
    }

    if (params.branch?.length) {
      query.append(
        "branchCode",
        params.branch.join(",")
      );
    }

    if (params.customer?.length) {
      query.append(
        "customer",
        params.customer.join(",")
      );
    }

    if (params.salesperson?.length) {
      query.append(
        "salesPerson",
        params.salesperson.join(",")
      );
    }

    if (params.product?.length) {
      query.append(
        "itemCode",
        params.product.join(",")
      );
    }

    if (params.packingType?.length) {
      query.append(
        "packingType",
        params.packingType.join(",")
      );
    }

    if (params.selectedQuarters?.length) {
      query.append(
        "quarter",
        params.selectedQuarters.join(",")
      );
    }

    if (params.selectedMonths?.length) {
      query.append(
        "monthName",
        params.selectedMonths.join(",")
      );
    }

    // Financial Year
    if (params.selectedYears?.length) {

      // if API expects code instead of label,
      // map properly here later

      query.append(
        "finYearCode",
        params.selectedYears.join(",")
      );
    }

    // Optional Dates
    if (params.dateFrom) {
      query.append(
        "dateFrom",
        params.dateFrom
      );
    }

    if (params.dateUpto) {
      query.append(
        "dateUpto",
        params.dateUpto
      );
    }

    const response = await fetch(
      `${API_BASE}/MA_ProductStats?${query.toString()}`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch product status"
      );
    }

    return await response.json();

  } catch (error) {

    console.error(
      "Product Status API Error:",
      error
    );

    return [];
  }
}

export async function getCustomerStatus(
  params = {}
) {

  try {

    const query = new URLSearchParams();

    // ================= FILTER MAP =================

    if (params.company?.length) {
      query.append(
        "companyCode",
        params.company.join(",")
      );
    }

    if (params.branch?.length) {
      query.append(
        "branchCode",
        params.branch.join(",")
      );
    }

    if (params.customer?.length) {
      query.append(
        "customer",
        params.customer.join(",")
      );
    }

    if (params.salesperson?.length) {
      query.append(
        "salesPerson",
        params.salesperson.join(",")
      );
    }

    if (params.product?.length) {
      query.append(
        "itemCode",
        params.product.join(",")
      );
    }

    if (params.packingType?.length) {
      query.append(
        "packingType",
        params.packingType.join(",")
      );
    }

    if (params.selectedQuarters?.length) {
      query.append(
        "quarter",
        params.selectedQuarters.join(",")
      );
    }

    if (params.selectedMonths?.length) {
      query.append(
        "monthName",
        params.selectedMonths.join(",")
      );
    }

    if (params.selectedYears?.length) {
      query.append(
        "finYearCode",
        params.selectedYears.join(",")
      );
    }

    if (params.dateFrom) {
      query.append(
        "dateFrom",
        params.dateFrom
      );
    }

    if (params.dateUpto) {
      query.append(
        "dateUpto",
        params.dateUpto
      );
    }

    const response = await fetch(
      `${API_BASE}/MA_CustomerStats?${query.toString()}`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch customer status"
      );
    }

    return await response.json();

  } catch (error) {

    console.error(
      "Customer Status API Error:",
      error
    );

    return [];
  }
}

export async function getCustomerProductSalesStats(
  params = {}
) {

  try {

    const query = new URLSearchParams();

    // ================= FILTER MAP =================

    if (params.company?.length) {
      query.append(
        "companyCode",
        params.company.join(",")
      );
    }

    if (params.branch?.length) {
      query.append(
        "branchCode",
        params.branch.join(",")
      );
    }

    if (params.customer?.length) {
      query.append(
        "customer",
        params.customer.join(",")
      );
    }

    if (params.salesperson?.length) {
      query.append(
        "salesPerson",
        params.salesperson.join(",")
      );
    }

    if (params.product?.length) {
      query.append(
        "itemCode",
        params.product.join(",")
      );
    }

    if (params.packingType?.length) {
      query.append(
        "packingType",
        params.packingType.join(",")
      );
    }

    if (params.selectedQuarters?.length) {
      query.append(
        "quarter",
        params.selectedQuarters.join(",")
      );
    }

    if (params.selectedMonths?.length) {
      query.append(
        "monthName",
        params.selectedMonths.join(",")
      );
    }

    if (params.selectedYears?.length) {
      query.append(
        "finYearCode",
        params.selectedYears.join(",")
      );
    }

    if (params.dateFrom) {
      query.append(
        "dateFrom",
        params.dateFrom
      );
    }

    if (params.dateUpto) {
      query.append(
        "dateUpto",
        params.dateUpto
      );
    }

    const response = await fetch(
      `${API_BASE}/MA_CustomerProductSalesStats?${query.toString()}`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch customer status"
      );
    }

    return await response.json();

  } catch (error) {

    console.error(
      "Customer Status API Error:",
      error
    );

    return [];
  }
}