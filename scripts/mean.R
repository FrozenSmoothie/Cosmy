# Command line arguments
args <- commandArgs(trailingOnly = TRUE)

# Convert command line arguments to numeric values
numbers <- as.numeric(args)

# Check if the input is valid
if (any(is.na(numbers))) {
  cat("Invalid input. Please provide valid numeric values.")
  quit(status = 1)
}

# Calculate the mean
mean_result <- mean(numbers)

# Print the mean result
cat(mean_result)