using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace TaoLa.Core
{
	public class SecureHelper
	{
		private static readonly byte[] _aeskeys = new byte[]
		{
			18,
			52,
			86,
			120,
			144,
			171,
			205,
			239,
			18,
			52,
			86,
			120,
			144,
			171,
			205,
			239
		};

		private static Regex _base64regex = new Regex("[A-Za-z0-9\\=\\/\\+]");

		private static Regex _sqlkeywordregex = new Regex("(select|insert|delete|from|count\\(|drop|table|update|truncate|asc\\(|mid\\(|char\\(|xp_cmdshell|exec|master|net|local|group|administrators|user|or|and|-|;|,|\\(|\\)|\\[|\\]|\\{|\\}|%|@|\\*|!|\\')", RegexOptions.IgnoreCase);

		public static string AESEncrypt(string encryptStr, string encryptKey)
		{
			string result;
			if (string.IsNullOrWhiteSpace(encryptStr))
			{
				result = string.Empty;
			}
			else
			{
				encryptKey = StringHelper.SubString(encryptKey, 32);
				encryptKey = encryptKey.PadRight(32, ' ');
				System.Security.Cryptography.SymmetricAlgorithm symmetricAlgorithm = System.Security.Cryptography.Rijndael.Create();
				byte[] bytes = System.Text.Encoding.UTF8.GetBytes(encryptStr);
				symmetricAlgorithm.Key = System.Text.Encoding.UTF8.GetBytes(encryptKey);
				symmetricAlgorithm.IV = SecureHelper._aeskeys;
				byte[] inArray = null;
				using (System.IO.MemoryStream memoryStream = new System.IO.MemoryStream())
				{
					using (System.Security.Cryptography.CryptoStream cryptoStream = new System.Security.Cryptography.CryptoStream(memoryStream, symmetricAlgorithm.CreateEncryptor(), System.Security.Cryptography.CryptoStreamMode.Write))
					{
						cryptoStream.Write(bytes, 0, bytes.Length);
						cryptoStream.FlushFinalBlock();
						inArray = memoryStream.ToArray();
						cryptoStream.Close();
						memoryStream.Close();
					}
				}
				result = System.Convert.ToBase64String(inArray);
			}
			return result;
		}

		public static string AESDecrypt(string decryptStr, string decryptKey)
		{
			string result;
			if (string.IsNullOrWhiteSpace(decryptStr))
			{
				result = string.Empty;
			}
			else
			{
				decryptKey = StringHelper.SubString(decryptKey, 32);
				decryptKey = decryptKey.PadRight(32, ' ');
				byte[] array = System.Convert.FromBase64String(decryptStr);
				System.Security.Cryptography.SymmetricAlgorithm symmetricAlgorithm = System.Security.Cryptography.Rijndael.Create();
				symmetricAlgorithm.Key = System.Text.Encoding.UTF8.GetBytes(decryptKey);
				symmetricAlgorithm.IV = SecureHelper._aeskeys;
				byte[] array2 = new byte[array.Length];
				using (System.IO.MemoryStream memoryStream = new System.IO.MemoryStream(array))
				{
					using (System.Security.Cryptography.CryptoStream cryptoStream = new System.Security.Cryptography.CryptoStream(memoryStream, symmetricAlgorithm.CreateDecryptor(), System.Security.Cryptography.CryptoStreamMode.Read))
					{
						cryptoStream.Read(array2, 0, array2.Length);
						cryptoStream.Close();
						memoryStream.Close();
					}
				}
				result = System.Text.Encoding.UTF8.GetString(array2).Replace("\0", "");
			}
			return result;
		}

		public static string MD5(string inputStr)
		{
			System.Security.Cryptography.MD5 mD = new System.Security.Cryptography.MD5CryptoServiceProvider();
			byte[] array = mD.ComputeHash(System.Text.Encoding.UTF8.GetBytes(inputStr));
			System.Text.StringBuilder stringBuilder = new System.Text.StringBuilder();
			byte[] array2 = array;
			for (int i = 0; i < array2.Length; i++)
			{
				byte b = array2[i];
				stringBuilder.Append(b.ToString("x").PadLeft(2, '0'));
			}
			return stringBuilder.ToString();
		}

		public static bool IsBase64String(string str)
		{
			return str == null || SecureHelper._base64regex.IsMatch(str);
		}

		public static bool IsSafeSqlString(string s)
		{
			return s == null || !SecureHelper._sqlkeywordregex.IsMatch(s);
		}

		public static string EncodeBase64(System.Text.Encoding encode, string source)
		{
			byte[] bytes = encode.GetBytes(source);
			return System.Convert.ToBase64String(bytes);
		}

		public static string EncodeBase64(string source)
		{
			return SecureHelper.EncodeBase64(System.Text.Encoding.UTF8, source);
		}

		public static string DecodeBase64(System.Text.Encoding encode, string result)
		{
			string result2 = "";
			byte[] bytes = System.Convert.FromBase64String(result);
			try
			{
				result2 = encode.GetString(bytes);
			}
			catch
			{
				result2 = result;
			}
			return result2;
		}

		public static string DecodeBase64(string result)
		{
			return SecureHelper.DecodeBase64(System.Text.Encoding.UTF8, result);
		}
	}
}
