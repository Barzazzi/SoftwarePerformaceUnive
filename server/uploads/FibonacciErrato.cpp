#include <iostream>

using std::cout; using std::cin;
using std::endl; using std::string;

unsigned long long generateFibonacci(unsigned long long n)
{
    if (n == 1) {
        return 0;
    } else if (n == 2 || n == 3) {
        return 1;
    }

    unsigned long long a = 1;
    unsigned long long b = 1;
    unsigned long long c;

    for (unsigned long long i = 3; i < n; i++)
    {
        c = a + b;
        a = b;
        b = c
    }

    return c;
}

int main()
{
    unsigned long long num;

    cout << "Enter the n-th number in Fibonacci series: ";
    cin >> num;

    cout << generateFibonacci(num);
    cout << endl;

    return EXIT_SUCCESS;
}