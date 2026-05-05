<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="/objekt">
        <xsl:for-each select="group">
            <h3><xsl:value-of select="@name"/></h3>
            <table>
                <thead>
                    <tr>
                        <th>Class</th>
                        <xsl:for-each select="class">
                            <td><xsl:value-of select="@name"/></td>
                        </xsl:for-each>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>Transferablility</th>
                        <xsl:for-each select="class">
                            <td>
                                <xsl:choose>
                                    <xsl:when test="transferable='true'">Yes</xsl:when>
                                    <xsl:otherwise>No</xsl:otherwise>
                                </xsl:choose>
                            </td>
                        </xsl:for-each>
                    </tr>
                    <tr>
                        <th>How to get</th>
                        <xsl:for-each select="class">
                            <td>
                                <xsl:value-of select="mint"/>
                            </td>
                        </xsl:for-each>
                    </tr>
                    <tr>
                        <th>Como minted</th>
                        <xsl:for-each select="class">
                            <td>
                                <xsl:value-of select="como"/>
                            </td>
                        </xsl:for-each>
                    </tr>
                    <tr>
                        <th>Monthly</th>
                        <xsl:for-each select="class">
                            <td>
                                <xsl:choose>
                                    <xsl:when test="recurrent='true'">Yes</xsl:when>
                                    <xsl:otherwise>No</xsl:otherwise>
                                </xsl:choose>
                            </td>
                        </xsl:for-each>
                    </tr>
                </tbody>
            </table>
        </xsl:for-each>
    </xsl:template>
</xsl:stylesheet>